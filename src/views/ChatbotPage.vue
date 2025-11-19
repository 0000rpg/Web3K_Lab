<script setup>
import { useChatStore } from '@/stores/chat-store';
import { storeToRefs } from 'pinia';
import { ref, onMounted, nextTick } from 'vue';

const chatStore = useChatStore();
const {
    messageHistory,
    useLocalStorage,
    apiKey,
    siteUrl,
    siteName,
    userInput,
    status,
    isGenerating,
} = storeToRefs(chatStore);

const chatContainer = ref(null);

onMounted(() => {
    chatStore.initialize();
});

const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatStore.sendMessage();
    }
};

// Прокрутка к последнему сообщению
const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
};

// Наблюдаем за изменениями истории сообщений для прокрутки
onMounted(() => {
    scrollToBottom();
});

// Функция для копирования LaTeX
const setupLatexCopy = () => {
    onMounted(() => {
        // Добавляем обработчики для копирования LaTeX
        const handleLatexClick = (event) => {
            const target = event.target.closest('.katex-block, .katex-inline');
            if (target && target.dataset.latex) {
                navigator.clipboard.writeText(target.dataset.latex).then(() => {
                    const originalTitle = target.title;
                    target.title = 'Скопировано!';
                    setTimeout(() => {
                        target.title = originalTitle || 'Нажмите чтобы скопировать LaTeX';
                    }, 2000);
                });
            }
        };

        // Добавляем подсказки при наведении
        const addLatexTooltips = () => {
            document.querySelectorAll('.katex-block, .katex-inline').forEach((el) => {
                if (!el.title) {
                    el.title = 'Нажмите чтобы скопировать LaTeX';
                    el.style.cursor = 'pointer';
                }
            });
        };

        document.addEventListener('click', handleLatexClick);

        // Добавляем tooltips после рендеринга сообщений
        setTimeout(addLatexTooltips, 100);
    });
};

setupLatexCopy();
</script>

<template>
    <main>
        <section class="mainTheme">
            <p>Панель для просмотра</p>
        </section>
        <article>
            <div class="container">
                <h3>Чат-бот</h3>
                <div class="model-info">
                    <h4>Используемая модель:</h4>
                    <p><strong>openai/gpt-oss-20b:free</strong> - бесплатная модель</p>
                </div>

                <div class="memory-options">
                    <label>
                        <input
                            type="radio"
                            name="memory-type"
                            :value="false"
                            v-model="useLocalStorage"
                            @change="chatStore.updateMemoryType"
                        />
                        Память сессии (до перезагрузки)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="memory-type"
                            :value="true"
                            v-model="useLocalStorage"
                            @change="chatStore.updateMemoryType"
                        />
                        Постоянная память (после перезагрузки)
                    </label>
                </div>

                <div class="input-group api-key" v-show="false">
                    <label for="api-key">API ключ:</label>
                    <input
                        type="text"
                        id="api-key"
                        v-model="apiKey"
                        placeholder="Введите ваш API ключ"
                    />
                </div>

                <div class="input-group site-url" v-show="false">
                    <label for="site-url">URL вашего сайта (опционально):</label>
                    <input
                        type="text"
                        id="site-url"
                        v-model="siteUrl"
                        placeholder="https://example.com"
                    />
                </div>

                <div class="input-group site-name" v-show="false">
                    <label for="site-name">Название сайта (опционально):</label>
                    <input type="text" id="site-name" v-model="siteName" placeholder="Мой сайт" />
                </div>

                <div class="input-group">
                    <label for="user-input">Ваше сообщение:</label>
                    <textarea
                        id="user-input"
                        v-model="userInput"
                        @keypress="handleKeyPress"
                        placeholder="Введите ваш вопрос или сообщение..."
                        :disabled="isGenerating"
                    ></textarea>
                </div>

                <button @click="chatStore.sendMessage" :disabled="isGenerating">
                    {{ isGenerating ? 'Генерация...' : 'Отправить сообщение' }}
                </button>

                <div class="session-controls">
                    <button @click="chatStore.clearHistory">Очистить историю</button>
                    <button @click="chatStore.saveSession">Сохранить сессию</button>
                    <button @click="chatStore.loadSession">Загрузить сессию</button>
                </div>

                <div
                    class="status"
                    :class="{
                        info: status,
                        error: status && status.includes('Ошибка'),
                    }"
                >
                    {{ status }}
                </div>
            </div>

            <div class="container">
                <h3>Диалог:</h3>
                <div class="chat-container" ref="chatContainer">
                    <div
                        v-for="(message, index) in messageHistory"
                        :key="index"
                        :class="[
                            'message',
                            message.role === 'user'
                                ? 'user-message'
                                : message.role === 'assistant'
                                  ? 'assistant-message'
                                  : 'error-message',
                        ]"
                        v-html="chatStore.formatMessage(message.content)"
                    ></div>
                </div>
            </div>
        </article>
    </main>
</template>

<style scoped>
:root {
    --theme: #ed6c21;
    --header: #18191a;
    --background: #1c1e21;
    --text: #f5f5f5;
    --snow: #ffffff;
    --border-accent: #757575;
    --border: #5c5c5c;
    --marker: #b3b3b3;
    --accent: #e05d2d;
    --section: rgba(34, 36, 39, 0.8);
    --aside-action: rgba(43, 45, 48, 0.8);
    --button: rgba(123, 123, 123, 0.185);

    --radius: 2em;
    --padding: 1em;
    --input-padding: 0.5em;
    --button-padding: 0.5em 1em;
    --message-padding: 0.5em 1em;
    --message-margin: 0.5em 0.5em 0.5em;
}

.container {
    h3 {
        margin-bottom: 0.8em;
        text-align: center;
        background-color: var(--header);
        margin: 0;
        padding: 0em 0.5em 0em 0.5em;
        min-height: 3em;
        min-width: 3em;
        border: solid var(--border);
        border-width: 0px 0px 1px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 1em;
    }
    h4 {
        margin-bottom: 0.8em;
        text-align: center;
        min-height: 2em;
        color: var(--theme);
        font-size: medium;
    }
    .model-info {
        p {
            text-align: center;
        }
        background-color: var(--aside-action);
        border-radius: calc(var(--radius) / 4);
        margin: 0.5em 0.5em 0.5em 0.5em;
    }
    .memory-options {
        label {
            display: flex;
            align-items: center;
            margin-bottom: 0;
        }
        input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            border-radius: 50%;
            width: 1.2em;
            height: 1.2em;
            aspect-ratio: 1;

            border: 2px solid var(--marker);
            transition: 0.2s all linear;
            outline: none;
            margin-right: 5px;
            margin-bottom: 2px;
        }
        input:checked {
            border: 4px solid var(--theme);
        }
        display: flex;
    }
    .chatbot-block {
        border: 1px solid var(--border);
        overflow: hidden;
    }

    .input-group {
        input[type='text'],
        textarea {
            padding: var(--input-padding);
            background-color: var(--aside-action);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: calc(var(--radius) / 4);
            font-size: 1em;
        }
        input[type='text']:focus,
        textarea:focus {
            border-color: var(--theme);
            outline: none;
        }
        textarea {
            min-height: 5em;
            font-size: 1.05em;
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        }
        max-width: 100%;
        margin: 1em 0.5em 1em 0.5em;
        display: flex;
        flex-direction: column;
    }
    #send-button {
        font-size: 1em;
        margin: 0.5em;
        padding: 0.5em;
        border: 0px;
        border-radius: 2em;
        background-color: var(--theme);
        color: var(--text);
        transition:
            0.1s ease,
            left 0.1s ease;
    }
    #send-button:hover {
        transform: scaleY(1.05);
        transform: scaleX(1.01);
        background-color: var(--accent);
    }
    .session-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        margin: 0.8em 0.5em 1em 0.5em;
    }
    .session-controls button {
        flex: 1;
        padding: 0.5em 0.1em 0.5em 0.1em;
        background-color: var(--button);
        border: 1px solid var(--border);
        color: var(--text);
        border-radius: var(--radius);
        transition:
            0.1s ease,
            left 0.1s ease;
    }
    .session-controls button:hover {
        background-color: var(--button);
        border: 3px solid var(--border-accent);
        transform: scale(1.02);
    }
    .chat-container {
        margin: 1em 0.5em 0.5em 0.5em;
        border: 1px solid var(--border);
        border-radius: calc(var(--radius) / 4);
        overflow-y: auto;
        background-color: var(--aside-action);
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: var(--accent) transparent;
        max-height: 80%;
        @media all and (max-width: 500px) {
            width: 100%;
            border-radius: 0;
            margin: 0;
        }
    }
    .message {
        margin: var(--message-margin);
        padding: var(--message-padding);
        border-radius: calc(var(--radius) / 4);
        line-height: 1.5;
    }

    .user-message {
        background-color: var(--header);
        border-left: 3px solid var(--theme);
    }

    .assistant-message {
        background-color: var(--aside-action);
        border-left: 3px solid var(--border-accent);
    }

    .error-message {
        background-color: var(--header);
        border-left: 3px solid var(--accent);
        color: var(--accent);
    }
    .status {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        padding: 0.5em;
        margin: 0.8em 0.5em 1em 0.5em;
        min-height: 2em;
        border-radius: calc(var(--radius) / 4);
        visibility: collapse;
    }
    .status.info {
        visibility: visible;
        background-color: var(--aside-action);
        color: var(--text);
    }

    .status.error {
        visibility: visible;
        background-color: var(--header);
        color: var(--accent);
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1em;
    overflow: hidden;
    flex-grow: 100;
    max-width: 100%;
    width: 100%;
    @media all and (max-width: 500px) {
        order: 1;
        width: 100%;
        border-radius: 0;
        margin: 0;
    }
}
/*LATEX */
/* Улучшенные стили для математических выражений */
.katex-block {
    margin: 1.5em 0;
    padding: 1.5em;
    background: linear-gradient(135deg, var(--aside-action) 0%, rgba(34, 36, 39, 0.8) 100%);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow-x: auto;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
}

.katex-block::before {
    content: 'Math';
    position: absolute;
    top: -10px;
    left: 20px;
    background: var(--theme);
    color: white;
    font-size: 0.8em;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.katex-inline {
    background: rgba(237, 108, 33, 0.1);
    padding: 0.2em 0.5em;
    border-radius: 6px;
    font-style: normal;
    border: 1px solid rgba(237, 108, 33, 0.3);
    margin: 0 0.2em;
}

.latex-error {
    background: rgba(224, 93, 45, 0.2);
    color: var(--accent);
    padding: 0.3em 0.6em;
    border-radius: 4px;
    border: 1px dashed var(--accent);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

/* Улучшенные стили для кода */
.code-block {
    background: var(--header);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.2em;
    margin: 1.2em 0;
    overflow-x: auto;
    position: relative;
}

.code-block::before {
    content: 'Code';
    position: absolute;
    top: -10px;
    left: 15px;
    background: var(--border-accent);
    color: var(--text);
    font-size: 0.8em;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.code-block code {
    background: none;
    padding: 0;
    border: none;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.95em;
    line-height: 1.4;
}

.inline-code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.85em;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Улучшенные таблицы */
.markdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    background: var(--aside-action);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.markdown-table th,
.markdown-table td {
    padding: 0.8em 1em;
    border: 1px solid var(--border);
    text-align: left;
}

.markdown-table th {
    background: var(--header);
    font-weight: bold;
    color: var(--theme);
}

.markdown-table tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
}

.markdown-table tr:hover {
    background: rgba(237, 108, 33, 0.05);
}

.table-container {
    overflow-x: auto;
    margin: 1.2em 0;
    border-radius: 8px;
}

/* Улучшенные списки */
.markdown-list {
    margin: 0.8em 0;
    padding-left: 2.2em;
}

.markdown-list li {
    margin: 0.4em 0;
    line-height: 1.6;
    position: relative;
}

.markdown-list li::before {
    content: '';
    position: absolute;
    left: -1.2em;
    top: 0.7em;
    width: 6px;
    height: 6px;
    background: var(--theme);
    border-radius: 50%;
}

/* Улучшенные блоки цитат */
.markdown-blockquote {
    border-left: 4px solid var(--theme);
    margin: 1.2em 0;
    padding: 1em 1.5em;
    background: linear-gradient(135deg, var(--aside-action) 0%, rgba(34, 36, 39, 0.6) 100%);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    position: relative;
}

.markdown-blockquote::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 2em;
    color: var(--theme);
    opacity: 0.3;
    font-family: serif;
}

/* Улучшенные параграфы */
.markdown-paragraph {
    line-height: 1.7;
    margin: 0.8em 0;
    text-align: justify;
}

.markdown-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 0.8em 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border);
}

.markdown-link {
    color: var(--theme);
    text-decoration: none;
    border-bottom: 1px solid var(--theme);
    transition: all 0.3s ease;
    padding: 0.1em 0.2em;
}

.markdown-link:hover {
    color: var(--accent);
    border-bottom-color: var(--accent);
    background: rgba(237, 108, 33, 0.1);
    border-radius: 3px;
}

/* Улучшенные заголовки */
.heading-1 {
    font-size: 2.2em;
    margin: 1em 0 0.5em 0;
    color: var(--theme);
    border-bottom: 2px solid var(--theme);
    padding-bottom: 0.3em;
}
.heading-2 {
    font-size: 1.8em;
    margin: 1.2em 0 0.6em 0;
    color: var(--theme);
}
.heading-3 {
    font-size: 1.4em;
    margin: 1em 0 0.5em 0;
    color: var(--text);
}
.heading-4 {
    font-size: 1.2em;
    margin: 1em 0 0.5em 0;
    color: var(--text);
}
.heading-5 {
    font-size: 1.1em;
    margin: 0.8em 0 0.4em 0;
    color: var(--text);
    font-style: italic;
}
.heading-6 {
    font-size: 1em;
    margin: 0.8em 0 0.4em 0;
    color: var(--border-accent);
    font-style: italic;
}

.divider {
    border: none;
    border-top: 2px solid var(--border);
    margin: 2em 0;
    position: relative;
}

.divider::after {
    content: '§';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--background);
    padding: 0 10px;
    color: var(--border-accent);
    font-size: 1.2em;
}

/* Анимации */
.message {
    transition: all 0.3s ease;
}

.message:hover {
    transform: translateX(5px);
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
    .katex-block {
        padding: 1em;
        font-size: 0.9em;
        margin: 1em 0;
    }

    .markdown-table {
        font-size: 0.85em;
    }

    .markdown-table th,
    .markdown-table td {
        padding: 0.6em 0.8em;
    }

    .code-block {
        padding: 1em;
        font-size: 0.9em;
    }

    .heading-1 {
        font-size: 1.8em;
    }
    .heading-2 {
        font-size: 1.5em;
    }
    .heading-3 {
        font-size: 1.2em;
    }
}

/* Подсветка синтаксиса (базовая) */
.code-block .keyword {
    color: #ff79c6;
}
.code-block .function {
    color: #50fa7b;
}
.code-block .string {
    color: #f1fa8c;
}
.code-block .comment {
    color: #6272a4;
    font-style: italic;
}
.code-block .number {
    color: #bd93f9;
}
.code-block .operator {
    color: #ff79c6;
}
</style>
