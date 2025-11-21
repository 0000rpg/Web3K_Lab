import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home, // It stays dynamic only for demonstration of another type of invoke.
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('../views/MainPage.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutMe.vue'),
        },
        {
            path: '/chatbot',
            name: 'chatbot',
            component: () => import('../views/ChatbotPage.vue'),
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('../views/ContactsPage.vue'),
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryPage.vue'),
        },
        {
            path: '/math',
            name: 'math',
            component: () => import('../views/MathTest.vue'),
        },
        {
            path: '/hobby',
            name: 'hobby',
            component: () => import('../views/MyHobby.vue'),
        },
        {
            path: '/album',
            name: 'album',
            component: () => import('../views/PhotoAlbum.vue'),
        },
        {
            path: '/study',
            name: 'study',
            component: () => import('../views/StudyPage.vue'),
        },
    ],
});

export default router;
