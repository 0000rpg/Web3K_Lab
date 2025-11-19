import { defineStore } from 'pinia';
import { useTextGenerationStore } from './text-generation';
import { EnhancedMarkdownToHTML } from './markdown-parser';
import { ref, computed } from 'vue';

export const useChatStore = defineStore('chat', () => {
    const textGenerationStore = useTextGenerationStore();
    const parser = new EnhancedMarkdownToHTML({
        enableLaTeX: true,
        allowHeading: true,
    });

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

    // Управление истории
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
            setStatus('Сессия загружена из локального хранилища', 'info');
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
