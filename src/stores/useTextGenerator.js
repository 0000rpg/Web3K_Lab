// hooks/useTextGenerator.js
import { useTextGenerationStore } from '@/stores/text-generation';
import { ref, computed } from 'vue';

export function useTextGenerator(sessionId = 'default') {
    const textGenerationStore = useTextGenerationStore();

    // Автоматическая инициализация при первом использовании
    const initialize = (apiKey) => {
        textGenerationStore.initialize(apiKey);
        textGenerationStore.createSession(sessionId);
    };

    // Универсальный метод генерации
    const generate = async (options = {}) => {
        const {
            prompt,
            messages = [],
            model = 'openai/gpt-oss-20b:free',
            stream = true,
            onText = () => {},
            onComplete = () => {},
            onError = () => {},
            headers = {},
        } = options;

        if (stream) {
            return await textGenerationStore.generateStream(sessionId, {
                prompt,
                messages,
                model,
                headers,
                onText,
                onComplete,
                onError,
            });
        } else {
            // Для не потоковой генерации
            const result = await textGenerationStore.generate({
                prompt,
                messages,
                model,
                headers,
            });
            onComplete(result);
            return result;
        }
    };

    // Привязка к DOM элементу для автоматического обновления
    const bindElement = (element) => {
        textGenerationStore.bindElement(sessionId, element);
    };

    // Состояние генерации
    const state = computed(() => textGenerationStore.getSession(sessionId) || {});

    const isGenerating = computed(() => state.value.isGenerating || false);
    const generatedText = computed(() => state.value.text || '');
    const error = computed(() => state.value.error || null);

    return {
        initialize,
        generate,
        bindElement,
        isGenerating,
        generatedText,
        error,
        state,
    };
}
