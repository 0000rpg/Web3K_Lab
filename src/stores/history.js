import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Маппинг путей к читаемым названиям страниц
const pageTitlesMap = {
    '/': 'Главная',
    '/main': 'Основная страница',
    '/about': 'Обо мне',
    '/chatbot': 'Помощь (Чат-бот)',
    '/contacts': 'Контакты',
    '/history': 'История просмотров',
    '/math': 'Математика',
    '/hobby': 'Хобби',
    '/album': 'Фотоальбом',
    '/study': 'Учеба',
};

export const useHistoryStore = defineStore('history', () => {
    // Состояния
    const sessionHistory = ref({});
    const allTimeHistory = ref({});

    // Геттеры
    const sessionHistoryData = computed(() => {
        return Object.entries(sessionHistory.value)
            .map(([page, count]) => ({
                page,
                title: pageTitlesMap[page] || getPageTitleFromPath(page),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    });

    const allTimeHistoryData = computed(() => {
        return Object.entries(allTimeHistory.value)
            .map(([page, count]) => ({
                page,
                title: pageTitlesMap[page] || getPageTitleFromPath(page),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    });

    // Вспомогательная функция для получения названия из пути
    function getPageTitleFromPath(path) {
        // Убираем параметры запроса
        const cleanPath = path.split('?')[0];

        // Если это корневой путь
        if (cleanPath === '/') return 'Главная';

        // Извлекаем название из пути и форматируем
        const pathParts = cleanPath.split('/').filter((part) => part);
        const lastPart = pathParts[pathParts.length - 1];

        // Преобразуем kebab-case в нормальный текст
        return lastPart
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setCookie(name, value, expiration_days) {
        const d = new Date();
        d.setTime(d.getTime() + expiration_days * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    function loadFromStorage() {
        // Загружаем данные из Local Storage
        const sessionData = localStorage.getItem('pageViewsSession');
        if (sessionData) {
            sessionHistory.value = JSON.parse(sessionData);
        }

        // Загружаем данные из Cookies
        const allTimeData = getCookie('pageViewsAllTime');
        if (allTimeData) {
            allTimeHistory.value = JSON.parse(allTimeData);
        }
    }

    function trackPageView(route) {
        const currentPage = route.path;
        const pageTitle = pageTitlesMap[currentPage] || getPageTitleFromPath(currentPage);

        // Обновляем историю сеанса
        sessionHistory.value[currentPage] = (sessionHistory.value[currentPage] || 0) + 1;
        localStorage.setItem('pageViewsSession', JSON.stringify(sessionHistory.value));

        // Обновляем историю за все время
        allTimeHistory.value[currentPage] = (allTimeHistory.value[currentPage] || 0) + 1;
        setCookie('pageViewsAllTime', JSON.stringify(allTimeHistory.value), 365);

        console.log(`Tracked: ${pageTitle} (${currentPage})`); // Для отладки
    }

    function clearSessionHistory() {
        sessionHistory.value = {};
        localStorage.removeItem('pageViewsSession');
    }

    function clearAllTimeHistory() {
        allTimeHistory.value = {};
        setCookie('pageViewsAllTime', '{}', -1);
    }

    // Инициализация - загружаем данные при создании хранилища
    loadFromStorage();

    return {
        sessionHistory: sessionHistoryData,
        allTimeHistory: allTimeHistoryData,
        trackPageView,
        clearSessionHistory,
        clearAllTimeHistory,
        loadFromStorage,
    };
});
