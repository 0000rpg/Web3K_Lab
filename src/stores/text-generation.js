import { defineStore } from 'pinia';
import { TextGenerator } from '@/assets/external-scripts/text-generator';
import { ref } from 'vue';

export const useTextGenerationStore = defineStore('textGeneration', () => {
    const generator = ref(null);
    const sessions = ref(new Map());

    // Инициализация генератора
    const initialize = (apiKey) => {
        generator.value = new TextGenerator(apiKey);
    };

    // Создание сессии
    const createSession = (sessionId) => {
        sessions.value.set(sessionId, {
            text: '',
            isGenerating: false,
            error: null,
            progress: 0,
            element: null,
        });
        return sessionId;
    };

    // Получение состояния сессии
    const getSession = (sessionId) => {
        return sessions.value.get(sessionId);
    };

    // Потоковая генерация
    const generateStream = async (sessionId, options = {}) => {
        if (!generator.value) {
            throw new Error('Generator not initialized. Call initialize() first.');
        }

        const session = getSession(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }

        session.isGenerating = true;
        session.error = null;
        session.text = '';
        session.progress = 0;

        const {
            prompt,
            messages = [],
            model = 'openai/gpt-oss-20b:free',
            headers = {},
            onText = null,
            onComplete = null,
            onError = null,
        } = options;

        try {
            await generator.value.generateStream({
                prompt,
                messages,
                model,
                headers,
                onText: (chunk, fullText) => {
                    session.text = fullText;
                    session.progress = Math.min(fullText.length / 1000, 1);

                    // Обновляем элемент если привязан
                    if (session.element) {
                        session.element.innerHTML = fullText.replace(/\n/g, '<br>');
                    }

                    if (onText) onText(chunk, fullText, sessionId);
                },
                onComplete: (fullText) => {
                    session.isGenerating = false;
                    session.progress = 1;
                    if (onComplete) onComplete(fullText, sessionId);
                },
                onError: (error) => {
                    session.error = error.message;
                    session.isGenerating = false;
                    if (onError) onError(error);
                },
            });
        } catch (error) {
            session.error = error.message;
            session.isGenerating = false;
            throw error;
        }
    };

    // Привязка DOM элемента к сессии
    const bindElement = (sessionId, element) => {
        const session = getSession(sessionId);
        if (session) {
            session.element = element;
        }
    };

    return {
        sessions,
        initialize,
        createSession,
        getSession,
        generateStream,
        bindElement,
    };
});
