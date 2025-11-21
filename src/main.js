import './assets/external-scripts/background.js';
import './assets/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { setupRouterHooks } from './router/hooks';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setupRouterHooks(router);

app.mount('#app');
