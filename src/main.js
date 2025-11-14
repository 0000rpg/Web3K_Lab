import './assets/external-scripts/background.js';

//import './assets/main.css';
import './assets/global/main.css';
import './assets/global/header.css';
import './assets/global/footer.css';
import './assets/global/tables.css';
import './assets/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
