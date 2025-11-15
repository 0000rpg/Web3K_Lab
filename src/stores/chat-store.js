import { defineStore } from 'pinia';
import { useTextGenerationStore } from './text-generation';
import { ref, computed } from 'vue';

// Переносим класс MarkdownToHTML внутрь файла хранилища
class MarkdownToHTML {
    constructor(options = {}) {
        this.options = {
            allowHeading: true,
            ...options,
        };
        this._codeBlocks = [];
    }

    parse(md) {
        if (!md || typeof md !== 'string') return '';

        md = md.replace(/\r\n?/g, '\n');
        md = this._extractFencedCodeBlocks(md);
        md = this._extractIndentedCodeBlocks(md);
        const html = this._blocksToHTML(md.trim());
        return this._restoreCodeBlocks(html);
    }

    _extractFencedCodeBlocks(text) {
        const fenceRegex = /(^|\n)```([a-zA-Z0-9_-]*)[ \t]*\n([\s\S]*?)\n```[ \t]*(?=\n|$)/g;
        return text.replace(fenceRegex, (_m, pfx, lang, body) => {
            const code = this._escapeHTML(body);
            const cls = lang ? ` class="language-${lang}"` : '';
            const html = `<pre><code${cls}>${code}</code></pre>`;
            return this._storeCode(html, pfx);
        });
    }

    _extractIndentedCodeBlocks(text) {
        const lines = text.split('\n');
        const out = [];
        let buf = [];
        let inBlock = false;

        const flush = () => {
            if (!buf.length) return;
            const raw = buf.map((l) => l.replace(/^(?: {4}|\t)/, '')).join('\n');
            const html = `<pre><code>${this._escapeHTML(raw)}</code></pre>`;
            out.push(this._storeCode(html));
            buf = [];
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (/^(?: {4}|\t)/.test(line)) {
                inBlock = true;
                buf.push(line);
            } else {
                if (inBlock) {
                    flush();
                    inBlock = false;
                }
                out.push(line);
            }
        }
        if (inBlock) flush();
        return out.join('\n');
    }

    _storeCode(html, prefix = '') {
        const token = `@@CODEBLOCK_${this._codeBlocks.length}@@`;
        this._codeBlocks.push(html);
        return `${prefix}${token}`;
    }

    _restoreCodeBlocks(html) {
        return html.replace(
            /@@CODEBLOCK_(\d+)@@/g,
            (_m, idx) => this._codeBlocks[Number(idx)] || '',
        );
    }

    _blocksToHTML(text) {
        const lines = text.split('\n');
        const out = [];

        let i = 0;
        while (i < lines.length) {
            if (/^\s*$/.test(lines[i])) {
                i++;
                continue;
            }

            if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
                out.push('<hr>');
                i++;
                continue;
            }

            if (this._looksLikeTableStart(lines, i)) {
                const { html, nextIndex } = this._consumeTable(lines, i);
                out.push(html);
                i = nextIndex;
                continue;
            }

            if (this._isListLine(lines[i])) {
                const { html, nextIndex } = this._consumeList(lines, i);
                out.push(html);
                i = nextIndex;
                continue;
            }

            if (/^\s*>\s?/.test(lines[i])) {
                const { html, nextIndex } = this._consumeBlockquote(lines, i);
                out.push(html);
                i = nextIndex;
                continue;
            }

            if (this.options.allowHeading && /^\s{0,3}#{1,6}\s+/.test(lines[i])) {
                const m = lines[i].match(/^\s{0,3}(#{1,6})\s+(.*)$/);
                const level = m[1].length;
                const content = this._inline(m[2]);
                out.push(`<h${level}>${content}</h${level}>`);
                i++;
                continue;
            }

            const { html, nextIndex } = this._consumeParagraph(lines, i);
            out.push(html);
            i = nextIndex;
        }

        return out.join('\n');
    }

    _looksLikeTableStart(lines, i) {
        if (i + 1 >= lines.length) return false;
        const header = lines[i].trim();
        const divider = lines[i + 1].trim();
        if (!/^\|/.test(header) || !/\|$/.test(header)) return false;
        if (!/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(divider)) return false;
        return true;
    }

    _consumeTable(lines, i) {
        const headerLine = lines[i].trim();
        const dividerLine = lines[i + 1].trim();
        let j = i + 2;
        const rows = [];
        while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) {
            rows.push(lines[j].trim());
            j++;
        }

        const aligns = dividerLine
            .replace(/^\|?/, '')
            .replace(/\|?$/, '')
            .split('|')
            .map((s) => s.trim())
            .map((s) =>
                s.startsWith(':') && s.endsWith(':')
                    ? 'center'
                    : s.startsWith(':')
                      ? 'left'
                      : s.endsWith(':')
                        ? 'right'
                        : null,
            );

        const headerCells = headerLine
            .replace(/^\|?/, '')
            .replace(/\|?$/, '')
            .split('|')
            .map((s) => s.trim());

        const thead = `<thead><tr>${headerCells
            .map((c, idx) => {
                const align = aligns[idx] ? ` style="text-align:${aligns[idx]};"` : '';
                return `<th${align}>${this._inline(c)}</th>`;
            })
            .join('')}</tr></thead>`;

        const tbodyRows = rows
            .map((r) => {
                const cells = r
                    .replace(/^\|?/, '')
                    .replace(/\|?$/, '')
                    .split('|')
                    .map((s) => s.trim());
                const tds = cells
                    .map((c, idx) => {
                        const align = aligns[idx] ? ` style="text-align:${aligns[idx]};"` : '';
                        return `<td${align}>${this._inline(c)}</td>`;
                    })
                    .join('');
                return `<tr>${tds}</tr>`;
            })
            .join('');

        const html = `<table class="table table--compact table--col-borders">\n${thead}\n<tbody>\n${tbodyRows}\n</tbody>\n</table>`;
        return { html, nextIndex: j };
    }

    _isListLine(line) {
        return /^\s*(?:[-+*]\s+|\d+\.\s+)/.test(line);
    }

    _consumeList(lines, i) {
        const block = [];
        let j = i;
        while (j < lines.length) {
            const line = lines[j];
            if (/^\s*$/.test(line)) {
                block.push(line);
                j++;
                continue;
            }
            if (this._isListLine(line) || /^\s{2,}(?:[-+*]\s+|\d+\.\s+)/.test(line)) {
                block.push(line);
                j++;
            } else {
                break;
            }
        }
        const html = this._renderListBlock(block);
        return { html, nextIndex: j };
    }

    _renderListBlock(blockLines) {
        const items = [];
        const stack = [{ type: null, indent: -2, children: items }];

        const getType = (line) => (/^\s*\d+\.\s+/.test(line) ? 'ol' : 'ul');
        const getIndent = (line) => {
            const m = line.match(/^\s*/)[0].length;
            const spaces = line.replace(/^(\s*)[\s\S]*$/, (_m, s) =>
                s.replace(/\t/g, '    '),
            ).length;
            return Math.floor(spaces / 2) * 2;
        };

        for (let raw of blockLines) {
            if (/^\s*$/.test(raw)) continue;
            const type = getType(raw);
            const indent = getIndent(raw);
            const content = raw.replace(/^\s*(?:[-+*]|\d+\.)\s+/, '');

            while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
            const parent = stack[stack.length - 1];
            let container = parent.children[parent.children.length - 1];
            if (!container || container.type !== type || container.indent !== indent) {
                container = { type, indent, children: [] };
                parent.children.push(container);
            }
            container.children.push({ type: 'li', indent: indent, content });
            stack.push({ type, indent, children: container.children });
            stack.pop();
        }

        const renderNodes = (nodes) => {
            let html = '';
            let i = 0;
            while (i < nodes.length) {
                const node = nodes[i];
                if (node.type === 'ul' || node.type === 'ol') {
                    const tag = node.type;
                    const lis = [];
                    let k = i + 1;
                    for (let j = i + 1; j < nodes.length; j++) {
                        if (nodes[j].type === 'li' && nodes[j].indent === node.indent) {
                            lis.push(nodes[j]);
                            k = j + 1;
                        } else if (nodes[j].type === 'ul' || nodes[j].type === 'ol') {
                            break;
                        } else {
                            break;
                        }
                    }
                    const inner = lis.map((li) => `<li>${this._inline(li.content)}</li>`).join('');
                    html += `<${tag}>${inner}</${tag}>`;
                    i = k;
                } else if (node.type === 'li') {
                    html += `<ul><li>${this._inline(node.content)}</li></ul>`;
                    i++;
                } else {
                    i++;
                }
            }
            return html;
        };

        const grouped = [];
        let buffer = null;
        for (const n of items) {
            if (n.type === 'ul' || n.type === 'ol') {
                if (buffer && buffer.type === n.type) {
                    buffer.children.push(...n.children.filter((c) => c.type === 'li'));
                } else {
                    if (buffer) grouped.push(buffer);
                    buffer = {
                        type: n.type,
                        indent: n.indent,
                        children: n.children.filter((c) => c.type === 'li'),
                    };
                }
            }
        }
        if (buffer) grouped.push(buffer);

        const html = grouped
            .map((group) => {
                const tag = group.type;
                const inner = group.children
                    .map((li) => `<li>${this._inline(li.content)}</li>`)
                    .join('');
                return `<${tag}>${inner}</${tag}>`;
            })
            .join('');

        return html || '';
    }

    _consumeBlockquote(lines, i) {
        const buf = [];
        let j = i;
        while (j < lines.length && /^\s*>\s?/.test(lines[j])) {
            buf.push(lines[j].replace(/^\s*>\s?/, ''));
            j++;
        }
        const inner = this._blocksToHTML(buf.join('\n'));
        const html = `<blockquote>\n${inner}\n</blockquote>`;
        return { html, nextIndex: j };
    }

    _consumeParagraph(lines, i) {
        const buf = [];
        let j = i;
        while (j < lines.length) {
            const line = lines[j];
            if (/^\s*$/.test(line)) break;
            if (
                /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line) ||
                this._looksLikeTableStart(lines, j) ||
                this._isListLine(line) ||
                /^\s*>\s?/.test(line) ||
                (this.options.allowHeading && /^\s{0,3}#{1,6}\s+/.test(line))
            ) {
                break;
            }
            buf.push(line);
            j++;
        }
        const text = buf.join('\n');
        const html = `<p>${this._inline(text)}</p>`;
        return { html, nextIndex: j };
    }

    _inline(text) {
        if (!text) return '';

        let out = this._escapeHTML(text);
        out = out.replace(/\\n/g, '<br>');

        const codeSpans = [];
        out = out.replace(/`([^`]+?)`/g, (_m, code) => {
            const token = `@@CODESPAN_${codeSpans.length}@@`;
            codeSpans.push(`<code>${this._escapeHTML(code)}</code>`);
            return token;
        });

        out = out.replace(/!\[([^\]]*?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt, url) => {
            return `<img src="${this._escapeAttr(url)}" alt="${this._escapeAttr(alt)}">`;
        });

        out = out.replace(
            /\[([^\]]+?)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
            (_m, text, url, title) => {
                const t = title ? ` title="${this._escapeAttr(title)}"` : '';
                return `<a href="${this._escapeAttr(url)}"${t} rel="noopener noreferrer" target="_blank">${text}</a>`;
            },
        );

        out = out.replace(
            /(\*\*\*|___)([\s\S]+?)\1/g,
            (_m, _tag, inner) => `<strong><em>${inner}</em></strong>`,
        );
        out = out.replace(
            /(\*\*|__)([\s\S]+?)\1/g,
            (_m, _tag, inner) => `<strong>${inner}</strong>`,
        );
        out = out.replace(/(\*|_)([^*_][\s\S]*?)\1/g, (_m, _tag, inner) => `<em>${inner}</em>`);
        out = out.replace(/~~([\s\S]+?)~~/g, (_m, inner) => `<del>${inner}</del>`);

        out = out.replace(/@@CODESPAN_(\d+)@@/g, (_m, idx) => codeSpans[Number(idx)]);

        return out;
    }

    _escapeHTML(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    _escapeAttr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }
}

export const useChatStore = defineStore('chat', () => {
    const textGenerationStore = useTextGenerationStore();
    const parser = new MarkdownToHTML();

    // Состояние чата
    const messageHistory = ref([]);
    const useLocalStorage = ref(true);
    const apiKey = ref('');
    const siteUrl = ref('');
    const siteName = ref('');
    const userInput = ref('');
    const status = ref('Готов к отправке сообщения');

    const CHAT_SESSION_ID = 'chat-session';

    // Инициализация
    const initialize = () => {
        textGenerationStore.createSession(CHAT_SESSION_ID);
        loadHistory();
    };

    // Загрузка истории
    const loadHistory = () => {
        let savedHistory;
        if (useLocalStorage.value) {
            savedHistory = localStorage.getItem('openrouterChatHistory');
        } else {
            savedHistory = sessionStorage.getItem('openrouterChatHistory');
        }

        messageHistory.value = savedHistory ? JSON.parse(savedHistory) : [];

        if (messageHistory.value.length === 0) {
            messageHistory.value.push({
                role: 'assistant',
                content: 'Привет! Я готов ответить на ваши вопросы.',
            });
        }
    };

    // Сохранение истории
    const saveHistory = () => {
        const historyToSave = JSON.stringify(messageHistory.value.filter((msg) => !msg.temporary));
        if (useLocalStorage.value) {
            localStorage.setItem('openrouterChatHistory', historyToSave);
        } else {
            sessionStorage.setItem('openrouterChatHistory', historyToSave);
        }
    };

    // Отправка сообщения
    const sendMessage = async () => {
        const message = userInput.value.trim();
        const currentApiKey =
            apiKey.value.trim() ||
            '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';

        if (!message) {
            setStatus('Ошибка: Введите сообщение', 'error');
            return;
        }

        // Добавляем сообщение пользователя
        addMessage('user', message);
        userInput.value = '';
        setStatus('Отправка запроса...', 'info');

        // Подготавливаем заголовки
        const headers = {};
        if (siteUrl.value.trim()) headers['HTTP-Referer'] = siteUrl.value.trim();
        if (siteName.value.trim()) headers['X-Title'] = siteName.value.trim();

        // Инициализируем генератор
        textGenerationStore.initialize(currentApiKey);

        try {
            await textGenerationStore.generateStream(CHAT_SESSION_ID, {
                messages: messageHistory.value,
                headers,
                onText: (chunk, fullText) => {
                    // Обновляем последнее сообщение ассистента или создаем новое
                    updateLastAssistantMessage(fullText);
                },
                onComplete: () => {
                    setStatus('Ответ получен', 'info');
                    saveHistory();
                },
            });
        } catch (error) {
            setStatus(`Ошибка: ${error.message}`, 'error');
            addMessage(
                'error',
                `Произошла ошибка: ${error.message}. Проверьте правильность API ключа.`,
                true,
            );
            throw error;
        }
    };

    // Вспомогательные методы
    const addMessage = (role, content, temporary = false) => {
        messageHistory.value.push({ role, content, temporary });
        if (!temporary) {
            saveHistory();
        }
    };

    const updateLastAssistantMessage = (content) => {
        const lastMessage = messageHistory.value[messageHistory.value.length - 1];
        if (lastMessage.role === 'assistant') {
            lastMessage.content = content;
        } else {
            addMessage('assistant', content);
        }
    };

    const setStatus = (message, type = 'info') => {
        status.value = message;
        if (type === 'info') {
            setTimeout(() => {
                if (status.value === message) {
                    status.value = '';
                }
            }, 5000);
        }
    };

    // Управление историей
    const clearHistory = () => {
        const welcomeMessage = messageHistory.value.find(
            (msg) => msg.role === 'assistant' && msg.content.includes('Привет'),
        ) || { role: 'assistant', content: 'Привет! Я готов ответить на ваши вопросы.' };

        messageHistory.value = [welcomeMessage];
        saveHistory();
        setStatus('История очищена', 'info');
    };

    const updateMemoryType = () => {
        setStatus(`Режим памяти: ${useLocalStorage.value ? 'Постоянная' : 'Сессии'}`, 'info');
        loadHistory();
    };

    // Сессионное управление
    const saveSession = () => {
        const sessionData = {
            history: messageHistory.value.filter((msg) => !msg.temporary),
            apiKey: apiKey.value,
            siteUrl: siteUrl.value,
            siteName: siteName.value,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem('openrouterSessionData', JSON.stringify(sessionData));
        setStatus('Сессия сохранена в локальное хранилище', 'info');
    };

    const loadSession = () => {
        const sessionData = localStorage.getItem('openrouterSessionData');
        if (!sessionData) {
            setStatus('Нет сохраненных сессий', 'error');
            return;
        }

        try {
            const data = JSON.parse(sessionData);
            messageHistory.value = data.history || [];
            apiKey.value = data.apiKey || '';
            siteUrl.value = data.siteUrl || '';
            siteName.value = data.siteName || '';
            saveHistory();
            setStatus('Сессия загружена из локального хранилище', 'info');
        } catch (e) {
            setStatus('Ошибка при загрузке сессии', 'error');
            console.error('Ошибка загрузки сессии:', e);
        }
    };

    // Форматирование сообщений
    const formatMessage = (content) => {
        return parser.parse(content);
    };

    // Геттеры
    const chatState = computed(() => textGenerationStore.getSession(CHAT_SESSION_ID) || {});

    const isGenerating = computed(() => chatState.value.isGenerating || false);

    return {
        // State
        messageHistory,
        useLocalStorage,
        apiKey,
        siteUrl,
        siteName,
        userInput,
        status,

        // Getters
        chatState,
        isGenerating,

        // Actions
        initialize,
        sendMessage,
        clearHistory,
        updateMemoryType,
        saveSession,
        loadSession,
        formatMessage,
        setStatus,
    };
});
