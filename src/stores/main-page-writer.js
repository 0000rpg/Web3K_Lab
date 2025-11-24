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
            'Здравствуй, творчески опиши личную страничку в соцсети образцового студента (твой текст является содержанием страницы, поэтому нужно описание без каких-либо разъяснений). Не используй никаких символов форматирования. Попробуй добавить немного интеллектуального юмора, но всё должно быть в рамках приличия. Пусть описание ведёт скромный человек (не нужно хвастаться). Техническая информация: ФИО не указывай, пол мужской, направление подготовки - информационные системы и технологии.';

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
