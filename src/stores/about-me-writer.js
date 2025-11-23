import { defineStore } from 'pinia';
import { useTextGenerationStore } from './text-generation';
import { ref } from 'vue';

export const useAboutMeAutoWriterStore = defineStore('aboutMeAutoWriter', () => {
    const textGenerationStore = useTextGenerationStore();
    const element = ref(null);

    const SESSION_ID = 'about-me-auto-writer';

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

    // Генерация IT-фактов
    const generateITFacts = async () => {
        const session = textGenerationStore.getSession(SESSION_ID);
        if (session?.isGenerating || session?.text) return;

        const prompt =
            'Привет, расскажи побольше интересных фактов о программировании или о каком-либо выбранном языке. Учти, что ты должен поразить профессионала в этой отрасли. Пиши без форматирования с хорошими отступами и без пояснений в виде диалога. Не пиши слова мне по типу понял тебя или хорошо.';

        try {
            await textGenerationStore.generateStream(SESSION_ID, {
                prompt,
                onError: (error) => {
                    if (element.value) {
                        element.value.textContent = `Не удалось сгенерировать факты. Ошибка: ${error.message}`;
                    }
                },
            });
        } catch (error) {
            if (element.value) {
                element.value.textContent = `Не удалось сгенерировать факты. Ошибка: ${error.message}`;
            }
            console.error('Ошибка генерации:', error);
        }
    };

    // Настройка автописателя
    const setupAutoWriter = (domElement) => {
        initialize();
        bindElement(domElement);

        const handleMouseOver = () => {
            generateITFacts();
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
        generateITFacts,
        setupAutoWriter,
        getState,
    };
});
