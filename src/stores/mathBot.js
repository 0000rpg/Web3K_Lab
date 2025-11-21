// stores/mathBot.js
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

    // Проверка производной
    const checkDerivative = async (userAnswer) => {
        const prompt = `
        Проверь математический ответ.
        Вопрос: "Найдите производную функции f(x) = x²"
        Ответ пользователя: "${userAnswer}"

        Правильный ответ: 2x или 2*x

        Проанализируй ответ пользователя и опреде, является ли он правильным.
        Учти возможные варианты записи: 2x, 2*x, x*2, два икс и т.д.

        Верни только JSON в формате:
        {
            "correct": true/false,
            "feedback": "краткое пояснение на русском",
            "expected": "2x"
        }
        `;

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

        try {
            // Парсим JSON из ответа
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Ошибка парсинга ответа бота:', error);
        }

        return {
            correct: false,
            feedback: 'Не удалось проверить ответ',
            expected: '2x',
        };
    };

    // Проверка утверждения (вопрос 4)
    const checkStatement = async (userAnswer, statementText) => {
        const prompt = `
        Проверь математическое утверждение.
        Утверждение: "${statementText}"
        Ответ пользователя: "${userAnswer}"

        Определи, верен ли ответ пользователя относительно утверждения.
        Учти, что ответ может быть "верно", "неверно", "да", "нет" или более развернутым.

        Верни только JSON в формате:
        {
            "correct": true/false,
            "feedback": "краткое пояснение на русском",
            "reason": "логическое обоснование"
        }
        `;

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

        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Ошибка парсинга ответа бота:', error);
        }

        return {
            correct: false,
            feedback: 'Не удалось проверить ответ',
            reason: 'Ошибка анализа',
        };
    };

    // Проверка интегралов (вопрос 2)
    const checkIntegrals = async (selectedOptions) => {
        const correctAnswers = ['1', '2', '3', '4']; // Правильные варианты
        const userAnswers = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];

        // Простая проверка на клиенте
        const allCorrect =
            correctAnswers.every((opt) => userAnswers.includes(opt)) &&
            userAnswers.every((opt) => correctAnswers.includes(opt));

        if (allCorrect) {
            return {
                correct: true,
                feedback: 'Все верно! Вы правильно выбрали утверждения об интегралах.',
            };
        }

        // Если есть ошибки, используем бота для пояснения
        const prompt = `
        Студент отвечал на вопрос о интегралах.
        Вопрос: "Выберите правильные утверждения об интегралах"

        Выбранные варианты: ${userAnswers.join(', ')}

        Правильные варианты: 1, 2, 3, 4
        (1 - Интеграл от производной функции равен самой функции,
         2 - Определенный интеграл вычисляется на отрезке,
         3 - Неопределенный интеграл имеет постоянную интегрирования,
         4 - Интеграл от суммы функций равен сумме интегралов этих функций)

        Вариант 5 неверен: "Интеграл от постоянной величины всегда равен нулю" - это неверно.

        Объясни ошибки студента кратко на русском.

        Верни JSON:
        {
            "correct": false,
            "feedback": "объяснение ошибок",
            "missing": [номера пропущенных правильных вариантов],
            "incorrect": [номера неправильно выбранных вариантов]
        }
        `;

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

        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Ошибка парсинга ответа бота:', error);
        }

        return {
            correct: false,
            feedback: 'Есть ошибки в выборе утверждений',
            missing: correctAnswers.filter((opt) => !userAnswers.includes(opt)),
            incorrect: userAnswers.filter((opt) => !correctAnswers.includes(opt)),
        };
    };

    return {
        initialize,
        checkDerivative,
        checkStatement,
        checkIntegrals,
    };
});
