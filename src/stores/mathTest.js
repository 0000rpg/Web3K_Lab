import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useMathBotStore } from './mathBot';

export const useMathTest = defineStore('mathTest', () => {
    const mathBotStore = useMathBotStore();

    // Инициализируем бота при создании store
    mathBotStore.initialize();

    const mathTestConstructor = ref([
        {
            label: 'ФИО:',
            for: 'test-name',
            input: {
                type: 'text',
                id: 'test-name',
                name: 'test-name',
                required: true,
            },
        },
        {
            label: 'Группа:',
            for: 'group',
            selectName: 'group',
            selectId: 'group',
            required: true,
            groups: [
                {
                    label: '1 курс',
                    options: [
                        { value: '11', text: 'ИТ-22' },
                        { value: '12', text: 'ИТ-23' },
                        { value: '13', text: 'ИТ-24' },
                        { value: '14', text: 'ИТ-25' },
                    ],
                },
                {
                    label: '2 курс',
                    options: [
                        { value: '21', text: 'ИС-21' },
                        { value: '22', text: 'ИС-22' },
                        { value: '23', text: 'ИС-23' },
                        { value: '24', text: 'ИС-24' },
                    ],
                },
                {
                    label: '3 курс',
                    options: [
                        { value: '31', text: 'ПИ-31' },
                        { value: '32', text: 'ПИ-32' },
                        { value: '33', text: 'ПИ-33' },
                        { value: '34', text: 'ПИ-34' },
                    ],
                },
                {
                    label: '4 курс',
                    options: [
                        { value: '41', text: 'ПИН-22' },
                        { value: '42', text: 'ПИН-23' },
                        { value: '43', text: 'ПИН-24' },
                        { value: '44', text: 'ПИН-25' },
                    ],
                },
            ],
        },
        {
            title: 'Вопрос 1: Производная функции',
            label: 'Ответ:',
            context: 'Найдите производную функции f(x) = x²:',
            for: 'derivative',
            input: {
                type: 'text',
                id: 'derivative',
                name: 'derivative',
                required: true,
            },
            usesBot: true,
        },
        {
            title: 'Вопрос 2: Интегралы',
            context: 'Выберите правильные утверждения об интегралах:',
            required: true,
            variables: [
                {
                    label: 'Интеграл от производной функции равен самой функции',
                    for: 'int1',
                    input: {
                        type: 'checkbox',
                        id: 'int1',
                        name: 'integrals',
                        value: '1',
                    },
                },
                {
                    label: 'Определенный интеграл вычисляется на отрезке',
                    for: 'int2',
                    input: {
                        type: 'checkbox',
                        id: 'int2',
                        name: 'integrals',
                        value: '2',
                    },
                },
                {
                    label: 'Неопределенный интеграл имеет постоянную интегрирования',
                    for: 'int3',
                    input: {
                        type: 'checkbox',
                        id: 'int3',
                        name: 'integrals',
                        value: '3',
                    },
                },
                {
                    label: 'Интеграл от суммы функций равен сумме интегралов этих функций',
                    for: 'int4',
                    input: {
                        type: 'checkbox',
                        id: 'int4',
                        name: 'integrals',
                        value: '4',
                    },
                },
                {
                    label: 'Интеграл от постоянной величины всегда равен нулю',
                    for: 'int5',
                    input: {
                        type: 'checkbox',
                        id: 'int5',
                        name: 'integrals',
                        value: '5',
                    },
                },
            ],
            usesBot: true,
        },
        {
            title: 'Вопрос 3: Матрицы',
            label: 'Выберите тип матрицы:',
            context: '[1 2 3 4]',
            for: 'matrix',
            selectName: 'matrix',
            selectId: 'matrix',
            required: true,
            groups: [
                {
                    label: 'Квадратные матрицы',
                    options: [
                        { value: 'diag', text: 'Диагональная' },
                        { value: 'unit', text: 'Единичная' },
                        { value: 'triang', text: 'Треугольная' },
                        { value: 'symm', text: 'Симметрическая' },
                    ],
                },
                {
                    label: 'Прямоугольные матрицы',
                    options: [
                        { value: 'row', text: 'Матрица-строка' },
                        { value: 'col', text: 'Матрица-столбец' },
                        { value: 'zero', text: 'Нулевая матрица' },
                    ],
                },
                {
                    label: 'Специальные матрицы',
                    options: [
                        { value: 'orthog', text: 'Ортогональная' },
                        { value: 'inv', text: 'Обратная' },
                        { value: 'trans', text: 'Транспонированная' },
                    ],
                },
            ],
        },
        {
            title: 'Вопрос 4: Верно ли утверждение?',
            label: 'Ответ:',
            context:
                'Утверждение: Существует непрерывная функция f, которая совпадает со своей собственной производной.',
            for: 'question',
            input: {
                type: 'text',
                id: 'question',
                name: 'question',
                required: true,
            },
            usesBot: true,
        },
        {
            controller: true,
            buttons: [
                {
                    type: 'submit',
                    value: 'Отправить',
                },
                {
                    type: 'reset',
                    value: 'Очистить форму',
                },
            ],
        },
    ]);

    const mathTestData = ref({
        'test-name': '',
        group: '',
        derivative: '',
        integrals: [],
        matrix: '',
        question: '',
    });

    const mathTestErrors = ref({
        'test-name': '',
        group: '',
        derivative: '',
        integrals: '',
        matrix: '',
        question: '',
    });

    const validationInProgress = ref(false);
    const botFeedback = ref({});

    // Простая валидация на клиенте
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'test-name':
                if (!value.trim()) {
                    mathTestErrors.value[fieldName] = 'ФИО должно быть заполнено!';
                } else if (value.trim().split(/\s+/).length < 2) {
                    mathTestErrors.value[fieldName] = 'Введите фамилию и имя!';
                } else {
                    mathTestErrors.value[fieldName] = '';
                }
                break;
            case 'group':
                if (!value) {
                    mathTestErrors.value[fieldName] = 'Выберите группу!';
                } else {
                    mathTestErrors.value[fieldName] = '';
                }
                break;
            case 'matrix':
                if (!value) {
                    mathTestErrors.value[fieldName] = 'Выберите тип матрицы!';
                } else {
                    mathTestErrors.value[fieldName] = '';
                }
                break;
            default:
                mathTestErrors.value[fieldName] = '';
                break;
        }
    };

    // Валидация с помощью бота
    const validateWithBot = async () => {
        validationInProgress.value = true;
        botFeedback.value = {};

        try {
            // Проверка производной
            if (mathTestData.value.derivative) {
                const derivativeResult = await mathBotStore.checkDerivative(
                    mathTestData.value.derivative,
                );
                if (!derivativeResult.correct) {
                    mathTestErrors.value.derivative = derivativeResult.feedback;
                    botFeedback.value.derivative = derivativeResult;
                } else {
                    mathTestErrors.value.derivative = '';
                }
            }

            // Проверка интегралов
            if (mathTestData.value.integrals && mathTestData.value.integrals.length > 0) {
                const integralsResult = await mathBotStore.checkIntegrals(
                    mathTestData.value.integrals,
                );
                if (!integralsResult.correct) {
                    mathTestErrors.value.integrals = integralsResult.feedback;
                    botFeedback.value.integrals = integralsResult;
                } else {
                    mathTestErrors.value.integrals = '';
                }
            }

            // Проверка утверждения (вопрос 4)
            if (mathTestData.value.question) {
                const statementText =
                    document.getElementById('question-text')?.value ||
                    'Математическое утверждение требует проверки';
                const questionResult = await mathBotStore.checkStatement(
                    mathTestData.value.question,
                    statementText,
                );
                if (!questionResult.correct) {
                    mathTestErrors.value.question = questionResult.feedback;
                    botFeedback.value.question = questionResult;
                } else {
                    mathTestErrors.value.question = '';
                }
            }
        } catch (error) {
            console.error('Ошибка при проверке ботом:', error);
        } finally {
            validationInProgress.value = false;
        }
    };

    const validateForm = async () => {
        // Базовая валидация
        validateField('test-name', mathTestData.value['test-name']);
        validateField('group', mathTestData.value.group);
        validateField('matrix', mathTestData.value.matrix);

        // Валидация сложных вопросов через бота
        await validateWithBot();

        return Object.values(mathTestErrors.value).every((error) => error === '');
    };

    const handleSubmit = async () => {
        if (await validateForm()) {
            console.log('Тест отправлен:', mathTestData.value);
            alert('Тест успешно отправлен!');

            // Здесь можно добавить отправку на сервер
            // await submitToServer(mathTestData.value);
        } else {
            console.log('Ошибки валидации:', mathTestErrors.value);
            alert('Пожалуйста, исправьте ошибки в форме');
        }
    };

    const resetForm = () => {
        mathTestData.value = {
            'test-name': '',
            group: '',
            derivative: '',
            integrals: [],
            matrix: '',
            question: '',
        };
        mathTestErrors.value = {
            'test-name': '',
            group: '',
            derivative: '',
            integrals: '',
            matrix: '',
            question: '',
        };
        botFeedback.value = {};
        validationInProgress.value = false;
    };

    // Вычисляемое свойство для валидности формы
    const isFormValid = computed(() => {
        return (
            Object.values(mathTestErrors.value).every((error) => error === '') &&
            !validationInProgress.value &&
            mathTestData.value['test-name'] &&
            mathTestData.value.group &&
            mathTestData.value.derivative &&
            mathTestData.value.integrals.length > 0 &&
            mathTestData.value.matrix &&
            mathTestData.value.question
        );
    });

    return {
        mathTestConstructor,
        contactsConstructor: mathTestConstructor,
        mathTestData,
        contactsData: mathTestData,
        mathTestErrors,
        contactsErrors: mathTestErrors,
        validationInProgress,
        botFeedback,
        validateField,
        validateForm,
        handleSubmit,
        resetForm,
        isFormValid,
    };
});
