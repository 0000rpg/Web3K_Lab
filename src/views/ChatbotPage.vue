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
    <main
        class="flex flex-row flex-wrap items-start min-w-[90%] min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Панель для просмотра
            </h2>
            <p class="text-white text-center p-4">Чат-бот для общения с AI моделью</p>
        </section>

        <article
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden text-white p-0"
        >
            <div class="w-full bg-[rgba(43,45,48,0.8)] p-0 rounded-lg">
                <h3
                    class="bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center rounded-t-lg"
                >
                    Чат-бот
                </h3>
                <div class="model-info bg-[rgba(43,45,48,0.8)] p-4 rounded-lg m-2">
                    <h4 class="text-[#ed6c21] text-center mb-2">Используемая модель:</h4>
                    <p class="text-white text-center">
                        <strong>openai/gpt-oss-20b:free</strong> - бесплатная модель
                    </p>
                </div>

                <div class="memory-options flex gap-4 justify-center mb-4 p-4">
                    <label class="flex items-center text-white">
                        <input
                            type="radio"
                            name="memory-type"
                            :value="false"
                            v-model="useLocalStorage"
                            @change="chatStore.updateMemoryType"
                            class="flex flex-col sm:flex-row sm:items-start sm:gap-4"
                        />
                        Память сессии (до перезагрузки)
                    </label>
                    <label class="flex items-center text-white">
                        <input
                            type="radio"
                            name="memory-type"
                            :value="true"
                            v-model="useLocalStorage"
                            @change="chatStore.updateMemoryType"
                            class="flex flex-col sm:flex-row sm:items-start sm:gap-4"
                        />
                        Постоянная память (после перезагрузки)
                    </label>
                </div>

                <div class="input-group api-key hidden">
                    <label for="api-key" class="text-white mb-2">API ключ:</label>
                    <input
                        type="text"
                        id="api-key"
                        v-model="apiKey"
                        placeholder="Введите ваш API ключ"
                        class="p-2 bg-[rgba(43,45,48,0.8)] text-white border border-[#5c5c5c] rounded-lg focus:border-[#ed6c21] outline-none"
                    />
                </div>

                <div class="input-group site-url hidden">
                    <label for="site-url" class="text-white mb-2"
                        >URL вашего сайта (опционально):</label
                    >
                    <input
                        type="text"
                        id="site-url"
                        v-model="siteUrl"
                        placeholder="https://example.com"
                        class="p-2 bg-[rgba(43,45,48,0.8)] text-white border border-[#5c5c5c] rounded-lg focus:border-[#ed6c21] outline-none"
                    />
                </div>

                <div class="input-group site-name hidden">
                    <label for="site-name" class="text-white mb-2"
                        >Название сайта (опционально):</label
                    >
                    <input
                        type="text"
                        id="site-name"
                        v-model="siteName"
                        placeholder="Мой сайт"
                        class="p-2 bg-[rgba(43,45,48,0.8)] text-white border border-[#5c5c5c] rounded-lg focus:border-[#ed6c21] outline-none"
                    />
                </div>

                <div class="input-group mb-4 p-4">
                    <label for="user-input" class="text-white mb-2">Ваше сообщение:</label>
                    <textarea
                        id="user-input"
                        v-model="userInput"
                        @keypress="handleKeyPress"
                        placeholder="Введите ваш вопрос или сообщение..."
                        :disabled="isGenerating"
                        class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 resize-y min-h-[100px] w-full"
                    ></textarea>
                </div>

                <div class="w-full p-4">
                    <button
                        @click="chatStore.sendMessage"
                        :disabled="isGenerating"
                        class="bg-[#ed6c21] text-white border-none p-4 rounded-full text-md transition-all duration-300 hover:bg-[#e05d2d] disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                        {{ isGenerating ? 'Генерация...' : 'Отправить сообщение' }}
                    </button>
                </div>

                <div class="session-controls flex gap-2 justify-center mt-4 p-4">
                    <button
                        @click="chatStore.clearHistory"
                        class="bg-[rgba(123,123,123,0.185)] text-white border border-[#5c5c5c] rounded-full py-2 px-4 flex-1 transition-all duration-300 hover:border-[#757575] hover:scale-105"
                    >
                        Очистить историю
                    </button>
                    <button
                        @click="chatStore.saveSession"
                        class="bg-[rgba(123,123,123,0.185)] text-white border border-[#5c5c5c] rounded-full py-2 px-4 flex-1 transition-all duration-300 hover:border-[#757575] hover:scale-105"
                    >
                        Сохранить сессию
                    </button>
                    <button
                        @click="chatStore.loadSession"
                        class="bg-[rgba(123,123,123,0.185)] text-white border border-[#5c5c5c] rounded-full py-2 px-4 flex-1 transition-all duration-300 hover:border-[#757575] hover:scale-105"
                    >
                        Загрузить сессию
                    </button>
                </div>

                <div
                    class="status mt-4 p-3 rounded-lg text-center min-h-[3em]"
                    :class="{
                        'bg-[rgba(43,45,48,0.8)] text-white': status && !status.includes('Ошибка'),
                        'bg-[#18191a] text-[#e05d2d]': status && status.includes('Ошибка'),
                        hidden: !status,
                    }"
                >
                    {{ status }}
                </div>
            </div>

            <div class="bg-[rgba(43,45,48,0.8)] p-0 rounded-lg w-full">
                <h3
                    class="bg-[#18191a] p-4 m-0 border-b border-t border-[#5c5c5c] text-white text-center"
                >
                    Диалог:
                </h3>
                <div
                    class="chat-container bg-[rgba(43,45,48,0.8)] overflow-y-auto max-h-[60vh] m-2 scrollbar-orange"
                    ref="chatContainer"
                >
                    <div
                        v-for="(message, index) in messageHistory"
                        :key="index"
                        :class="[
                            'message p-4 m-2 rounded-lg transition-all duration-300 hover:translate-x-1',
                            message.role === 'user'
                                ? 'bg-[#18191a] border-l-4 border-[#ed6c21]'
                                : message.role === 'assistant'
                                  ? 'bg-[rgba(43,45,48,0.8)] border-l-4 border-[#757575]'
                                  : 'bg-[#18191a] border-l-4 border-[#e05d2d] text-[#e05d2d]',
                        ]"
                        v-html="chatStore.formatMessage(message.content)"
                    ></div>
                </div>
            </div>
        </article>
    </main>
</template>

<style scoped>
.scrollbar-orange::-webkit-scrollbar {
    height: 6px;
    width: 6px;
}

.scrollbar-orange::-webkit-scrollbar-track {
    background: #18191a;
    border-radius: 10px;
}

.scrollbar-orange::-webkit-scrollbar-thumb {
    background: #e05d2d;
    border-radius: 10px;
}

.scrollbar-orange::-webkit-scrollbar-thumb:hover {
    background: #ed6c21;
}

.scrollbar-orange {
    scrollbar-width: thin;
    scrollbar-color: #e05d2d #18191a;
}
</style>

<style>
/* Стили для форматирования сообщений */
.katex-block {
    margin: 1.5em 0;
    padding: 1.5em;
    background: linear-gradient(135deg, rgba(43, 45, 48, 0.8) 0%, rgba(34, 36, 39, 0.8) 100%);
    border: 1px solid #5c5c5c;
    border-radius: 12px;
    overflow-x: auto;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
}

.katex-block::before {
    content: 'Math';
    position: absolute;
    top: -10px;
    left: 20px;
    background: #ed6c21;
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
    cursor: pointer;
}

.code-block {
    background: #18191a;
    border: 1px solid #5c5c5c;
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
    background: #757575;
    color: #f5f5f5;
    font-size: 0.8em;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.inline-code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.85em;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.markdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    background: rgba(43, 45, 48, 0.8);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.markdown-table th,
.markdown-table td {
    padding: 0.8em 1em;
    border: 1px solid #5c5c5c;
    text-align: left;
    color: white;
}

.markdown-table th {
    background: #18191a;
    font-weight: bold;
    color: #ed6c21;
}

.markdown-blockquote {
    border-left: 4px solid #ed6c21;
    margin: 1.2em 0;
    padding: 1em 1.5em;
    background: linear-gradient(135deg, rgba(43, 45, 48, 0.8) 0%, rgba(34, 36, 39, 0.6) 100%);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    position: relative;
}

.markdown-link {
    color: #ed6c21;
    text-decoration: none;
    border-bottom: 1px solid #ed6c21;
    transition: all 0.3s ease;
    padding: 0.1em 0.2em;
}

.markdown-link:hover {
    color: #e05d2d;
    border-bottom-color: #e05d2d;
    background: rgba(237, 108, 33, 0.1);
    border-radius: 3px;
}

/* Заголовки */
.heading-1 {
    font-size: 2.2em;
    margin: 1em 0 0.5em 0;
    color: #ed6c21;
    border-bottom: 2px solid #ed6c21;
    padding-bottom: 0.3em;
}
.heading-2 {
    font-size: 1.8em;
    margin: 1.2em 0 0.6em 0;
    color: #ed6c21;
}
.heading-3 {
    font-size: 1.4em;
    margin: 1em 0 0.5em 0;
    color: #f5f5f5;
}

@media (max-width: 768px) {
    .katex-block {
        padding: 1em;
        font-size: 0.9em;
        margin: 1em 0;
    }

    .markdown-table {
        font-size: 0.85em;
    }

    .heading-1 {
        font-size: 1.8em;
    }
    .heading-2 {
        font-size: 1.5em;
    }
}
</style>
