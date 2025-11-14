import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TextGenerator } from '@/assets/external-scripts/text-generator';

export const useTextGenerationStore = defineStore('textGeneration', () => {
    // State
    const generatedText = ref('');
    const isGenerating = ref(false);
    const error = ref(null);
    const progress = ref(0);
    const generator = ref(null);

    // Getters
    const hasError = computed(() => error.value !== null);
    const isEmpty = computed(() => generatedText.value === '');
    const textLength = computed(() => generatedText.value.length);

    // Actions
    const initializeGenerator = (apiKey, defaultModel = 'openai/gpt-oss-20b:free') => {
        generator.value = new TextGenerator(apiKey);
        error.value = null;
    };

    const generateText = async (options = {}) => {
        if (!generator.value) {
            throw new Error('Text generator not initialized. Call initializeGenerator first.');
        }

        // Сброс состояния
        generatedText.value = '';
        isGenerating.value = true;
        error.value = null;
        progress.value = 0;

        const {
            prompt,
            messages = [],
            model = 'openai/gpt-oss-20b:free',
            onText = null,
            onComplete = null,
            headers = {},
        } = options;

        try {
            const result = await generator.value.generateStream({
                prompt,
                messages,
                model,
                headers,
                onText: (chunk, fullText) => {
                    generatedText.value = fullText;
                    // Пример простого прогресса (можно адаптировать под ваши нужды)
                    progress.value = Math.min(fullText.length / 1000, 1);
                    // Вызов пользовательского колбека если есть
                    if (onText) onText(chunk, fullText);
                },
                onComplete: (fullText) => {
                    progress.value = 1;
                    if (onComplete) onComplete(fullText);
                },
            });

            return result;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            isGenerating.value = false;
        }
    };

    // Упрощенный метод для быстрой генерации по промпту
    const generateFromPrompt = async (prompt, model = 'openai/gpt-oss-20b:free') => {
        return await generateText({ prompt, model });
    };

    // Генерация с историей сообщений (для чата)
    const generateWithHistory = async (messages, model = 'openai/gpt-oss-20b:free') => {
        return await generateText({ messages, model });
    };

    const abortGeneration = () => {
        if (generator.value) {
            generator.value.abort();
            isGenerating.value = false;
            progress.value = 0;
        }
    };

    const clearText = () => {
        generatedText.value = '';
        error.value = null;
        progress.value = 0;
    };

    const setError = (message) => {
        error.value = message;
    };

    const clearError = () => {
        error.value = null;
    };

    // Пример для миграции старого функционала автописателя
    const generateAutoWriter = async (elementId, prompt, customModel = null) => {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id ${elementId} not found`);
        }

        element.innerHTML = '';

        await generateText({
            prompt,
            model: customModel || 'openai/gpt-oss-20b:free',
            onText: (chunk, fullText) => {
                // заменяем \n на <br> как в оригинальном коде
                element.innerHTML = fullText.replace(/\n/g, '<br>');
            },
        });
    };

    // Пример для миграции чат-бота
    const generateChatResponse = async (apiKey, messageHistory, siteUrl = '', siteName = '') => {
        const headers = {};
        if (siteUrl) headers['HTTP-Referer'] = siteUrl;
        if (siteName) headers['X-Title'] = siteName;

        initializeGenerator(apiKey);

        return await generateText({
            messages: messageHistory,
            headers,
        });
    };

    return {
        // State
        generatedText,
        isGenerating,
        error,
        progress,

        // Getters
        hasError,
        isEmpty,
        textLength,

        // Actions
        initializeGenerator,
        generateText,
        generateFromPrompt,
        generateWithHistory,
        abortGeneration,
        clearText,
        setError,
        clearError,
        generateAutoWriter,
        generateChatResponse,
    };
});
