import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home, // It stays dynamic only for demonstration of another type of invoke.
            title: 'Главная страница - изменения',
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('../views/MainPage.vue'),
            title: 'Главная страница - навигация',
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutMe.vue'),
            title: 'Информация об авторе',
        },
        {
            path: '/chatbot',
            name: 'chatbot',
            component: () => import('../views/ChatbotPage.vue'),
            title: '',
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('../views/ContactsPage.vue'),
            title: 'Контакты',
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryPage.vue'),
            title: 'История просмотров',
        },
        {
            path: '/math',
            name: 'math',
            component: () => import('../views/MathTest.vue'),
            title: 'Тест по высшей математике',
        },
        {
            path: '/hobby',
            name: 'hobby',
            component: () => import('../views/MyHobby.vue'),
            title: 'Мои интересы',
        },
        {
            path: '/album',
            name: 'album',
            component: () => import('../views/PhotoAlbum.vue'),
            title: 'Фотоальбом',
        },
        {
            path: '/study',
            name: 'study',
            component: () => import('../views/StudyPage.vue'),
            title: 'Учёба',
        },
    ],
});

router.beforeEach((to) => {
    if (to.title) {
        document.title = to.title;
    }
});

export default router;
