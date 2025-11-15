import { defineStore } from 'pinia';
import { useTextGenerationStore } from './text-generation';
import { ref } from 'vue';

export const useAutoWriterStore = defineStore('autoWriter', () => {
    const textGenerationStore = useTextGenerationStore();
    const element = ref(null);

    const SESSION_ID = 'auto-writer';

    // Инициализация автописателя
    const initialize = (
        apiKey = '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',
    ) => {
        textGenerationStore.initialize(apiKey);
        textGenerationStore.createSession(SESSION_ID);
    };

    // Привязка DOM элемента
    const bindElement = (domElement) => {
        element.value = domElement;
        textGenerationStore.bindElement(SESSION_ID, domElement);
    };

    // Генерация описания
    const generateDescription = async () => {
        const session = textGenerationStore.getSession(SESSION_ID);
        if (session?.isGenerating || session?.text) return;

        const prompt =
            'Описание принципа работы событий DOM. Ответ должен быть кратким, информативным и на русском языке.';

        try {
            await textGenerationStore.generateStream(SESSION_ID, {
                prompt,
                onError: (error) => {
                    if (element.value) {
                        element.value.textContent = `Не удалось сгенерировать описание. Ошибка: ${error.message}`;
                    }
                },
            });
        } catch (error) {
            if (element.value) {
                element.value.textContent = `Не удалось сгенерировать описание. Ошибка: ${error.message}`;
            }
            console.error('Ошибка генерации:', error);
        }
    };

    // Настройка автописателя
    const setupAutoWriter = (domElement) => {
        initialize();
        bindElement(domElement);

        const handleMouseOver = () => {
            generateDescription();
        };

        // Добавляем обработчик
        if (domElement) {
            domElement.addEventListener('mouseover', handleMouseOver);
        }

        // Функция для очистки
        return () => {
            if (domElement) {
                domElement.removeEventListener('mouseover', handleMouseOver);
            }
        };
    };

    // Получение состояния
    const getState = () => {
        return textGenerationStore.getSession(SESSION_ID) || {};
    };

    return {
        initialize,
        bindElement,
        generateDescription,
        setupAutoWriter,
        getState,
    };
});
