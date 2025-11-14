import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', () => {
    const textExamples = ref([
        {
            name: 'Обычный:',
            text: 'Пример текста с шрифтом Arial обычного начертания',
            class: 'normal',
        },
        {
            name: 'Курсив:',
            text: 'Пример текста с шрифтом Arial курсивного начертания',
            class: 'italic',
        },
        {
            name: 'Жирный:',
            text: 'Пример текста с шрифтом Arial жирного начертания',
            class: 'bold',
        },
        {
            name: 'Жирный курсив:',
            text: 'Пример текста с шрифтом Arial жирного курсивного начертания',
            class: 'bold-italic',
        },
        {
            name: 'Полужирный:',
            text: 'Пример текста с шрифтом Arial полужирного начертания (если доступно)',
            class: 'semibold',
        },
        {
            name: 'Светлый:',
            text: 'Пример текста с шрифтом Arial светлого начертания (если доступно)',
            class: 'light',
        },
    ]);

    const notesText = ref([
        'Arial - системный шрифт, поэтому он не требует загрузки или подключения через @font-face',
        'Всегда указывайте резервный шрифт (обычно sans-serif) на случай, если Arial не будет доступен',
        'Не все варианты начертания (особенно светлые и полужирные) могут поддерживаться во всех системах',
        'Для точного контроля над отображением необходимо подключить веб-версию Arial через сервисы вроде Google Fonts',
    ]);

    const navRoutes = ref([
        {
            link: '#start',
            text: 'Начало',
            isRoute: false,
        },
        {
            link: '#fonts-article',
            text: 'Шрифты',
            isRoute: false,
        },
        {
            link: '/chatbot',
            text: 'Помощь',
            isRoute: true,
        },
        {
            link: '/history',
            text: 'История',
            isRoute: true,
        },
    ]);

    return { textExamples, notesText, navRoutes };
});
