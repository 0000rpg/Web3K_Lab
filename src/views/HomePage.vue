<script setup>
import { useHomeStore } from '../stores/home';
import { storeToRefs } from 'pinia';

const homeStore = useHomeStore();
const { textExamples, notesText, navRoutes } = storeToRefs(homeStore);
</script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Текущая версия страницы - 2.1.2</h2>
            <p>Будет обновляться в зависимости от работ</p>
        </section>
        <article>
            <header>
                <h2 id="fonts-article">Использование шрифта Arial с различными начертаниями</h2>
                <p>Дата публикации - 13.09.2025</p>
            </header>
            <section>
                <h3>Готовые примеры</h3>
                <div class="example">
                    <p v-for="item in textExamples" :key="item.id">
                        <span class="property">{{ item.name }}</span>
                        <span v-bind:class="item.class">{{ item.text }}</span>
                    </p>
                </div>
            </section>
            <section>
                <h3>Реализация</h3>
                <div class="example">
                    <h2>Как использовать в CSS:</h2>
                    <pre>
/* Указание семейства шрифтов */
body {
    font-family: Arial, sans-serif;
}

/* Обычное начертание */
.normal {
    font-style: normal;
    font-weight: normal;
}

/* Курсив */
.italic {
    font-style: italic;
    font-weight: normal;
}

/* Жирный */
.bold {
    font-style: normal;
    font-weight: bold;
}

/* Жирный курсив */
.bold-italic {
    font-style: italic;
    font-weight: bold;
}

/* Полужирный (значение 600) */
.semibold {
    font-weight: 600;
}

/* Светлый (значение 300) */
.light {
    font-weight: 300;
}
                    </pre>
                </div>
                <aside>
                    <p>Не забывайте о html тегах по типу & ltstrong & gt.</p>
                </aside>
                <div class="example">
                    <ul>
                        <li v-for="note in notesText" :key="note.id">{{ note }}</li>
                    </ul>
                </div>
            </section>
            <footer>
                <p>Автор статьи: неизвестный знаток.</p>
            </footer>
        </article>
        <aside class="aside-box">
            <section>
                <h3>Категории</h3>
                <ul>
                    <li
                        v-for="(route, index) in navRoutes"
                        :key="route.id"
                        :class="{ 'bottom-gap': index === navRoutes.length - 1 }"
                    >
                        <RouterLink v-if="route.isRoute" v-bind:to="route.link">{{
                            route.text
                        }}</RouterLink>
                        <a v-else v-bind:href="route.link">{{ route.text }}</a>
                    </li>
                </ul>
            </section>
        </aside>
    </main>
</template>

<style scoped>
.example {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    width: 100%;
    overflow-x: auto;
    --webkit-overflow-scrolling: touch;
}

.normal {
    font-style: normal;
    font-weight: normal;
}

.italic {
    font-style: italic;
    font-weight: normal;
}

.bold {
    font-style: normal;
    font-weight: bold;
}

.bold-italic {
    font-style: italic;
    font-weight: bold;
}

.semibold {
    font-style: normal;
    font-weight: 600; /* Полужирный */
}

.light {
    font-style: normal;
    font-weight: 300; /* Светлый */
}

.property {
    display: inline-block;
    width: 120px;
    font-weight: bold;
    color: #ed6c21;
}
</style>
