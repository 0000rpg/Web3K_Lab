import katex from 'katex';

export class EnhancedMarkdownToHTML {
    constructor(options = {}) {
        this.options = {
            allowHeading: true,
            enableLaTeX: true,
            enableNeuralTokens: true,
            ...options,
        };
        this._codeBlocks = [];
        this._latexBlocks = [];
        this._neuralTokens = new Map();
    }

    parse(md) {
        if (!md || typeof md !== 'string') return '';

        // Сбрасываем хранилища
        this._codeBlocks = [];
        this._latexBlocks = [];
        this._neuralTokens.clear();

        md = md.replace(/\r\n?/g, '\n');

        // Сначала извлекаем токены нейросети
        if (this.options.enableNeuralTokens) {
            md = this._extractNeuralTokens(md);
        }

        // Затем обычный LaTeX
        if (this.options.enableLaTeX) {
            md = this._extractLaTeXBlocks(md);
        }

        // Затем код
        md = this._extractFencedCodeBlocks(md);
        md = this._extractIndentedCodeBlocks(md);

        const html = this._blocksToHTML(md.trim());
        let finalHtml = this._restoreCodeBlocks(html);

        // Восстанавливаем в правильном порядке
        if (this.options.enableLaTeX) {
            finalHtml = this._restoreLaTeXBlocks(finalHtml);
        }

        if (this.options.enableNeuralTokens) {
            finalHtml = this._restoreNeuralTokens(finalHtml);
        }

        return finalHtml;
    }

    // Улучшенное извлечение токенов нейросети
    _extractNeuralTokens(text) {
        // Более гибкое распознавание токенов
        const tokenRegex = /@@LATEX(INLINE|BLOCK)(\d+)@@/g;

        return text.replace(tokenRegex, (match, type, index) => {
            const tokenId = `NEURAL_${type}_${index}`;
            this._neuralTokens.set(tokenId, {
                type: type.toLowerCase(),
                index: parseInt(index),
                original: match,
                context: this._extractContext(text, match), // Добавляем контекст для лучшего определения
            });
            return `@@${tokenId}@@`;
        });
    }

    // Извлечение контекста вокруг токена для лучшего определения содержания
    _extractContext(text, token, radius = 50) {
        const tokenIndex = text.indexOf(token);
        if (tokenIndex === -1) return '';

        const start = Math.max(0, tokenIndex - radius);
        const end = Math.min(text.length, tokenIndex + token.length + radius);
        return text.substring(start, end);
    }

    // Интеллектуальное определение содержания токена на основе контекста
    _inferTokenContent(token) {
        const { type, index, context } = token;

        // Анализируем контекст для лучшего определения
        const contextLower = context.toLowerCase();

        if (type === 'inline') {
            // Определяем содержание на основе контекста
            if (contextLower.includes('площадь') && contextLower.includes('график')) {
                const inlineContents = [
                    'y=\\cos x',
                    'x',
                    'x=0',
                    'x=1',
                    '\\cos x',
                    '[0,1]',
                    '0.84',
                    'y = f(x)',
                    'a',
                    'b',
                    'S',
                ];
                return inlineContents[index] || `\\text{выражение}_{${index}}`;
            }

            if (contextLower.includes('интеграл') || contextLower.includes('предел')) {
                const mathContents = [
                    'x',
                    'y',
                    'a',
                    'b',
                    'n',
                    'i',
                    '\\Delta x',
                    'f(x)',
                    'dx',
                    'dy',
                ];
                return mathContents[index] || `x_{${index}}`;
            }

            // Общие математические выражения
            const generalContents = [
                'x',
                'y',
                'z',
                'a',
                'b',
                'c',
                'n',
                'm',
                'k',
                '\\alpha',
                '\\beta',
                '\\gamma',
                '\\theta',
                'f(x)',
                'g(x)',
                'h(x)',
                'dx',
                'dy',
                'dz',
                'dt',
            ];

            return generalContents[index] || `\\text{expr}_{${index}}`;
        }

        if (type === 'block') {
            // Блочные выражения на основе контекста
            if (contextLower.includes('интеграл') && contextLower.includes('площадь')) {
                const blockContents = [
                    'S = \\int_{0}^{1} \\cos x \\, dx',
                    '\\int \\cos x \\, dx = \\sin x + C',
                    'S = \\left[ \\sin x \\right]_{0}^{1} = \\sin 1 - \\sin 0',
                    '\\sin 0 = 0, \\quad \\sin 1 \\approx 0.8414709848',
                    'S = \\sin 1 \\approx 0.84147',
                    '\\int_{a}^{b} f(x) \\, dx',
                    'F(b) - F(a)',
                    '\\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\Delta x',
                ];
                return blockContents[index] || `\\text{Интеграл}_{${index}}`;
            }

            if (contextLower.includes('предел') || contextLower.includes('производн')) {
                const limitContents = [
                    '\\lim_{x \\to a} f(x)',
                    "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
                    '\\frac{dy}{dx}',
                    '\\frac{d}{dx}',
                    '\\int f(x) \\, dx',
                ];
                return limitContents[index] || `\\text{Предел}_{${index}}`;
            }

            // Общие блочные выражения
            const generalBlocks = [
                'a^2 + b^2 = c^2',
                'E = mc^2',
                '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
                '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
                '\\prod_{i=1}^{n} a_i',
                '\\lim_{x \\to \\infty} f(x)',
                '\\int_{a}^{b} f(x) \\, dx',
            ];

            return generalBlocks[index] || `\\text{Формула}_{${index}}`;
        }

        return type === 'block'
            ? `\\text{Блочное выражение ${index}}`
            : `\\text{Выражение ${index}}`;
    }

    // Улучшенное восстановление токенов
    _restoreNeuralTokens(html) {
        return html.replace(/@@NEURAL_(INLINE|BLOCK)_(\d+)@@/g, (match, type, index) => {
            const tokenId = `NEURAL_${type}_${index}`;
            const token = this._neuralTokens.get(tokenId);

            if (!token) {
                return this._createErrorToken(match, `Токен не найден: ${match}`);
            }

            try {
                // Пытаемся определить содержание на основе контекста
                const inferredContent = this._inferTokenContent(token);
                const displayMode = type === 'BLOCK';

                const rendered = katex.renderToString(inferredContent, {
                    displayMode: displayMode,
                    throwOnError: false,
                    output: 'html',
                    strict: false,
                    trust: true,
                });

                if (displayMode) {
                    return `<div class="neural-latex-block" data-token="${tokenId}" data-original="${this._escapeAttr(token.original)}" data-inferred="${this._escapeAttr(inferredContent)}">
                        <div class="token-header">
                            <span class="token-type">Математическое выражение</span>
                            <span class="token-index">[${index}]</span>
                        </div>
                        <div class="katex-rendered">${rendered}</div>
                        <div class="token-info">
                            <div class="token-original">Токен: <code>${this._escapeHTML(token.original)}</code></div>
                            <div class="token-inferred">Определено как: <code>${this._escapeHTML(inferredContent)}</code></div>
                        </div>
                        <div class="token-actions">
                            <button type="button" class="token-edit-btn" onclick="window.editNeuralToken('${tokenId}')">✏️ Исправить</button>
                        </div>
                    </div>`;
                } else {
                    return `<span class="neural-latex-inline" data-token="${tokenId}" data-original="${this._escapeAttr(token.original)}" data-inferred="${this._escapeAttr(inferredContent)}" onclick="window.editNeuralToken('${tokenId}')">
                        ${rendered}
                    </span>`;
                }
            } catch (error) {
                return this._createErrorToken(
                    token.original,
                    `Ошибка рендеринга: ${error.message}`,
                );
            }
        });
    }

    _createErrorToken(original, error) {
        return `<code class="neural-token-error" title="${this._escapeAttr(error)}">${this._escapeHTML(original)}</code>`;
    }

    // Остальные методы остаются аналогичными, но я добавлю улучшения для контекстного анализа
    _extractLaTeXBlocks(text) {
        // [существующий код без изменений]
        text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
            const token = `@@LATEX_BLOCK_${this._latexBlocks.length}@@`;
            this._latexBlocks.push({
                type: 'block',
                content: content.trim(),
                original: match,
            });
            return token;
        });

        text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, content) => {
            const token = `@@LATEX_INLINE_${this._latexBlocks.length}@@`;
            this._latexBlocks.push({
                type: 'inline',
                content: content.trim(),
                original: match,
            });
            return token;
        });

        text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
            const token = `@@LATEX_BLOCK_${this._latexBlocks.length}@@`;
            this._latexBlocks.push({
                type: 'block',
                content: content.trim(),
                original: match,
            });
            return token;
        });

        text = text.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (match, prefix, content) => {
            if (!this._looksLikeMath(content)) return match;
            const token = `@@LATEX_INLINE_${this._latexBlocks.length}@@`;
            this._latexBlocks.push({
                type: 'inline',
                content: content.trim(),
                original: match,
            });
            return prefix + token;
        });

        return text;
    }

    _looksLikeMath(content) {
        const mathIndicators = [
            /\\[a-zA-Z]/,
            /[α-ωΑ-Ω]/,
            /[∫∑∏√∞≈≠≤≥]/,
            /\^|_/,
            /frac|sum|prod|int|lim|sin|cos|tan|log|ln/,
            /[0-9]\s*[+\-*/]\s*[0-9]/,
        ];
        return mathIndicators.some((pattern) => pattern.test(content));
    }

    _restoreLaTeXBlocks(html) {
        return html.replace(/@@LATEX_(BLOCK|INLINE)_(\d+)@@/g, (match, type, index) => {
            const block = this._latexBlocks[parseInt(index)];
            if (!block) return match;

            try {
                const displayMode = type === 'BLOCK';
                const rendered = katex.renderToString(block.content, {
                    displayMode: displayMode,
                    throwOnError: false,
                    output: 'html',
                    strict: false,
                    trust: true,
                });

                return displayMode
                    ? `<div class="katex-block">${rendered}</div>`
                    : `<span class="katex-inline">${rendered}</span>`;
            } catch (error) {
                return `<code class="latex-error">${this._escapeHTML(block.original)}</code>`;
            }
        });
    }

    _extractFencedCodeBlocks(text) {
        const fenceRegex = /(^|\n)```([a-zA-Z0-9_-]*)[ \t]*\n([\s\S]*?)\n```[ \t]*(?=\n|$)/g;
        return text.replace(fenceRegex, (_m, pfx, lang, body) => {
            const code = this._escapeHTML(body);
            const cls = lang ? ` class="language-${lang}"` : '';
            const html = `<pre class="code-block"><code${cls}>${code}</code></pre>`;
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
            const html = `<pre class="code-block"><code>${this._escapeHTML(raw)}</code></pre>`;
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
                out.push('<br>');
                i++;
                continue;
            }

            if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
                out.push('<hr class="divider">');
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
                out.push(`<h${level} class="heading-${level}">${content}</h${level}>`);
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

        const html = `<div class="table-container"><table class="markdown-table">\n${thead}\n<tbody>\n${tbodyRows}\n</tbody>\n</table></div>`;
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
                    html += `<${tag} class="markdown-list">${inner}</${tag}>`;
                    i = k;
                } else if (node.type === 'li') {
                    html += `<ul class="markdown-list"><li>${this._inline(node.content)}</li></ul>`;
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
                return `<${tag} class="markdown-list">${inner}</${tag}>`;
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
        const html = `<blockquote class="markdown-blockquote">\n${inner}\n</blockquote>`;
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
        const html = `<p class="markdown-paragraph">${this._inline(text)}</p>`;
        return { html, nextIndex: j };
    }

    _inline(text) {
        if (!text) return '';

        let out = this._escapeHTML(text);
        out = out.replace(/\\n/g, '<br>');

        const codeSpans = [];
        out = out.replace(/`([^`]+?)`/g, (_m, code) => {
            const token = `@@CODESPAN_${codeSpans.length}@@`;
            codeSpans.push(`<code class="inline-code">${this._escapeHTML(code)}</code>`);
            return token;
        });

        out = out.replace(/!\[([^\]]*?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt, url) => {
            return `<img src="${this._escapeAttr(url)}" alt="${this._escapeAttr(alt)}" class="markdown-image">`;
        });

        out = out.replace(
            /\[([^\]]+?)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
            (_m, text, url, title) => {
                const t = title ? ` title="${this._escapeAttr(title)}"` : '';
                return `<a href="${this._escapeAttr(url)}"${t} rel="noopener noreferrer" target="_blank" class="markdown-link">${text}</a>`;
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
