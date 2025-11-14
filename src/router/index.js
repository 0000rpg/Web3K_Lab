import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

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
            component: () => import('../views/Main.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutMe.vue'),
        },
        {
            path: '/chatbot',
            name: 'chatbot',
            component: () => import('../views/Chatbot.vue'),
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('../views/Contacts.vue'),
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/History.vue'),
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
            component: () => import('../views/Study.vue'),
        },
    ],
});

export default router;
