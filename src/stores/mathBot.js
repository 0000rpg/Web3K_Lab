import { defineStore } from 'pinia';
import { useTextGenerationStore } from './text-generation';

export const useMathBotStore = defineStore('mathBot', () => {
    const textGenerationStore = useTextGenerationStore();
    const SESSION_ID = 'math-bot-checker';

    // Инициализация бота
    const initialize = (
        apiKey = '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',
    ) => {
        textGenerationStore.initialize(apiKey);
        textGenerationStore.createSession(SESSION_ID);
    };

    // Единая проверка всей формы с тремя попытками
    const validateAllAnswers = async (formData) => {
        const prompt = `
        Проверь ответы студента на тест по высшей математике. Ответь строго в формате JSON.

        Вопрос 1: "Найдите производную функции f(x) = x²"
        Ответ студента: "${formData.derivative}"
        Правильный ответ: 2x

        Вопрос 2: "Выберите правильные утверждения об интегралах"
        Выбранные варианты: ${formData.integrals.join(', ') || 'не выбрано'}
        Правильные варианты: 1, 2, 3, 4
        (1 - Интеграл от производной функции равен самой функции - ВЕРНО
         2 - Определенный интеграл вычисляется на отрезке - ВЕРНО
         3 - Неопределенный интеграл имеет постоянную интегрирования - ВЕРНО
         4 - Интеграл от суммы функций равен сумме интегралов этих функций - ВЕРНО
         5 - Интеграл от постоянной величины всегда равен нулю - НЕВЕРНО)

        Вопрос 4: "Утверждение: Существует непрерывная функция f, которая совпадает со своей собственной производной."
        Ответ студента: "${formData.question}"
        Правильный ответ: верно (это экспоненциальная функция e^x)

        Проанализируй ответы и верни JSON в формате:
        {
            "derivative": {
                "correct": true/false,
                "feedback": "краткое пояснение на русском",
                "expected": "2x"
            },
            "integrals": {
                "correct": true/false,
                "feedback": "краткое пояснение на русском",
                "missing": [номера пропущенных правильных вариантов],
                "incorrect": [номера неправильно выбранных вариантов]
            },
            "statement": {
                "correct": true/false,
                "feedback": "краткое пояснение на русском",
                "reason": "логическое обоснование"
            }
        }
        `;

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                attempts++;
                let result = '';

                await textGenerationStore.generateStream(SESSION_ID, {
                    prompt,
                    onText: (chunk, fullText) => {
                        result = fullText;
                    },
                    onComplete: (fullText) => {
                        result = fullText;
                    },
                });

                console.log(`Попытка ${attempts}, ответ бота:`, result);

                // Парсим JSON из ответа
                const jsonMatch = result.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedResult = JSON.parse(jsonMatch[0]);

                    // Проверяем структуру ответа
                    if (
                        parsedResult.derivative &&
                        parsedResult.integrals &&
                        parsedResult.statement
                    ) {
                        return parsedResult;
                    }
                }

                // Если не удалось распарсить или неверная структура, пробуем еще раз
                if (attempts < maxAttempts) {
                    console.log(
                        `Неверный формат ответа, попытка ${attempts + 1} из ${maxAttempts}`,
                    );
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка между попытками
                }
            } catch (error) {
                console.error(`Ошибка при попытке ${attempts}:`, error);
                if (attempts < maxAttempts) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        }

        // Если все попытки неудачны, возвращаем стандартный ответ
        console.log('Все попытки завершились неудачей, возвращаем стандартный ответ');
        return {
            derivative: {
                correct: false,
                feedback: 'Не удалось проверить ответ',
                expected: '2x',
            },
            integrals: {
                correct: false,
                feedback: 'Не удалось проверить ответ',
                missing: [],
                incorrect: [],
            },
            statement: {
                correct: false,
                feedback: 'Не удалось проверить ответ',
                reason: 'Ошибка проверки',
            },
        };
    };

    // Старые методы для обратной совместимости (можно удалить после обновления)
    const checkDerivative = async (userAnswer) => {
        const result = await validateAllAnswers({
            derivative: userAnswer,
            integrals: [],
            question: '',
        });
        return result.derivative;
    };

    const checkStatement = async (userAnswer, statementText) => {
        const result = await validateAllAnswers({
            derivative: '',
            integrals: [],
            question: userAnswer,
        });
        return result.statement;
    };

    const checkIntegrals = async (selectedOptions) => {
        const userAnswers = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
        const result = await validateAllAnswers({
            derivative: '',
            integrals: userAnswers,
            question: '',
        });
        return result.integrals;
    };

    return {
        initialize,
        validateAllAnswers,
        checkDerivative,
        checkStatement,
        checkIntegrals,
    };
});
