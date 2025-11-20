import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useContactsStore = defineStore('contacts', () => {
    const contactsConstructor = ref([
        {
            label: 'ФИО:',
            for: 'name',
            input: {
                type: 'text',
                id: 'name',
                name: 'name',
            },
        },
        {
            label: 'Пол:',
            variables: [
                {
                    label: 'Мужской',
                    for: 'male',
                    input: {
                        type: 'radio',
                        id: 'male',
                        name: 'gender',
                        value: 'male',
                    },
                },
                {
                    label: 'Женский',
                    for: 'female',
                    input: {
                        type: 'radio',
                        id: 'female',
                        name: 'gender',
                        value: 'female',
                    },
                },
            ],
        },
        {
            label: 'Возраст:',
            for: 'age',
            selectName: 'age',
            selectId: 'age',
            components: [
                {
                    value: 'less16',
                    text: 'До 16',
                },
                {
                    value: '16to18',
                    text: '16-18',
                },
                {
                    value: '18to30',
                    text: '18-30',
                },
                {
                    value: 'moreThan30',
                    text: '30+',
                },
            ],
        },
        {
            label: 'Телефон:',
            for: 'phone',
            input: {
                type: 'text',
                id: 'phone',
                name: 'phone',
            },
        },
        {
            label: 'E-mail:',
            for: 'email',
            input: {
                type: 'email',
                id: 'email',
                name: 'email',
            },
        },
        {
            label: 'Дата рождения:',
            for: 'birthdate',
            customComponent: 'Calendar',
        },
        {
            label: 'Сообщение:',
            for: 'message',
            textarea: {
                rows: '5',
                id: 'message',
                name: 'message',
            },
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

    const contactsData = ref({
        name: '',
        gender: '',
        age: '',
        phone: '',
        email: '',
        birthdate: '',
        message: '',
    });

    const contactsErrors = ref({
        name: '',
        gender: '',
        phone: '',
        email: '',
        birthdate: '',
        message: '',
    });

    // Вычисляемое свойство для проверки валидности формы
    const isFormValid = computed(() => {
        return (
            Object.values(contactsErrors.value).every((error) => error === '') &&
            contactsData.value.name &&
            contactsData.value.phone &&
            contactsData.value.email &&
            contactsData.value.message
        );
    });

    // Валидация
    const validateFIO = (fio) => {
        const words = fio.trim().split(/\s+/);
        return words.length === 3;
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+7|8)\d{9,11}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Валидация отдельных полей
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    contactsErrors.value.name = 'ФИО должно быть заполнено!';
                } else if (!validateFIO(value)) {
                    contactsErrors.value.name = 'ФИО должно состоять из трех слов!';
                } else {
                    contactsErrors.value.name = '';
                }
                break;

            case 'phone':
                if (!value.trim()) {
                    contactsErrors.value.phone = 'Телефон должен быть заполнен!';
                } else if (!validatePhone(value)) {
                    contactsErrors.value.phone =
                        'Телефон должен начинаться с +7 или 8, содержать только цифры!';
                } else {
                    contactsErrors.value.phone = '';
                }
                break;

            case 'email':
                if (!value.trim()) {
                    contactsErrors.value.email = 'Email должен быть заполнен!';
                } else if (!validateEmail(value)) {
                    contactsErrors.value.email = 'Неверный формат email!';
                } else {
                    contactsErrors.value.email = '';
                }
                break;

            case 'message':
                if (!value.trim()) {
                    contactsErrors.value.message = 'Сообщение должно быть заполнено!';
                } else {
                    contactsErrors.value.message = '';
                }
                break;

            default:
                break;
        }
    };

    // Валидация всей формы
    const validateForm = () => {
        validateField('name', contactsData.value.name);
        validateField('phone', contactsData.value.phone);
        validateField('email', contactsData.value.email);
        validateField('message', contactsData.value.message);

        return isFormValid.value;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Отправка формы
            console.log('Форма отправлена:', contactsData.value);
            alert('Форма успешно отправлена!');
            // Здесь может быть логика отправки на сервер
        } else {
            console.log('Ошибки валидации:', contactsErrors.value);
            alert('Пожалуйста, исправьте ошибки в форме');
        }
    };

    // Сброс формы
    const resetForm = () => {
        contactsData.value = {
            name: '',
            gender: '',
            age: '',
            phone: '',
            email: '',
            birthdate: '',
            message: '',
        };
        contactsErrors.value = {
            name: '',
            gender: '',
            phone: '',
            email: '',
            birthdate: '',
            message: '',
        };
    };

    const updateAgeFromBirthdate = (birthdate) => {
        if (!birthdate) return;

        try {
            const [day, month, year] = birthdate.split('.');
            const birthDate = new Date(year, month - 1, day);
            const now = new Date();
            let age = now.getFullYear() - birthDate.getFullYear();
            const mDiff = now.getMonth() - birthDate.getMonth();

            if (mDiff < 0 || (mDiff === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 16) contactsData.value.age = 'less16';
            else if (age < 18) contactsData.value.age = '16to18';
            else if (age < 30) contactsData.value.age = '18to30';
            else contactsData.value.age = 'moreThan30';
        } catch (error) {
            console.error('Ошибка при вычислении возраста:', error);
        }
    };

    return {
        contactsConstructor,
        contactsData,
        contactsErrors,
        isFormValid,
        validateForm,
        validateField,
        handleSubmit,
        resetForm,
        updateAgeFromBirthdate,
    };
});
