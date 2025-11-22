import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'Главная страница - изменения',
                h1: 'Главная страница - изменения',
            },
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('../views/MainPage.vue'),
            meta: {
                title: 'Главная страница - навигация',
                h1: 'Главная страница - навигация',
            },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutMe.vue'),
            meta: {
                title: 'Информация об авторе',
                h1: 'Информация об авторе',
            },
        },
        {
            path: '/chatbot',
            name: 'chatbot',
            component: () => import('../views/ChatbotPage.vue'),
            meta: {
                title: 'Чат-бот',
                h1: '',
            },
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('../views/ContactsPage.vue'),
            meta: {
                title: 'Контакты',
                h1: 'Контакты',
            },
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryPage.vue'),
            meta: {
                title: 'История просмотров',
                h1: 'История просмотров',
            },
        },
        {
            path: '/math',
            name: 'math',
            component: () => import('../views/MathTest.vue'),
            meta: {
                title: 'Тест по высшей математике',
                h1: 'Тест по высшей математике',
            },
        },
        {
            path: '/hobby',
            name: 'hobby',
            component: () => import('../views/MyHobby.vue'),
            meta: {
                title: 'Мои интересы',
                h1: 'Мои интересы',
            },
        },
        {
            path: '/album',
            name: 'album',
            component: () => import('../views/PhotoAlbum.vue'),
            meta: {
                title: 'Фотоальбом',
                h1: 'Фотоальбом',
            },
        },
        {
            path: '/study',
            name: 'study',
            component: () => import('../views/StudyPage.vue'),
            meta: {
                title: 'Учёба',
                h1: 'Учёба',
            },
        },
    ],
});

export default router;
