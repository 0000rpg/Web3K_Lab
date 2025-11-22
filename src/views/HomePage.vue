<script setup>
import { useHomeStore } from '../stores/home';
import { storeToRefs } from 'pinia';

const homeStore = useHomeStore();
const { textExamples, notesText, navRoutes } = storeToRefs(homeStore);
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-full min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden text-center m-2"
        >
            <h2 class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c]">
                Текущая версия страницы - 2.1.2
            </h2>
            <p class="text-sm p-2">Будет обновляться в зависимости от работ</p>
        </section>

        <article
            class="bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] m-2 flex flex-col min-w-[65%] flex-grow overflow-hidden"
        >
            <header class="flex flex-col justify-center text-center">
                <h2
                    class="min-w-full bg-[#18191a] m-0 p-4 min-h-[2.3em] border-b border-[#5c5c5c] flex items-center justify-center"
                    id="fonts-article"
                >
                    Использование шрифта Arial с различными начертаниями
                </h2>
                <p class="text-sm p-2">Дата публикации - 13.09.2025</p>
            </header>

            <section class="m-4">
                <h3 class="border-y border-[#5c5c5c] py-2 m-0">Готовые примеры</h3>
                <div
                    class="font-['Arial','sans-serif'] leading-relaxed w-full overflow-x-auto mt-4"
                >
                    <p v-for="item in textExamples" :key="item.id" class="mb-3">
                        <span class="inline-block w-32 font-bold text-[#ed6c21]">{{
                            item.name
                        }}</span>
                        <span v-bind:class="item.class">{{ item.text }}</span>
                    </p>
                </div>
            </section>

            <section class="m-4">
                <h3 class="border-y border-[#5c5c5c] py-2 m-0">Реализация</h3>
                <div
                    class="font-['Arial','sans-serif'] leading-relaxed w-full overflow-x-auto mt-4"
                >
                    <h2 class="text-lg font-bold mb-4">Как использовать в CSS:</h2>
                    <pre
                        class="bg-[#1c1e21] p-4 rounded-lg overflow-x-auto text-sm border border-[#5c5c5c]"
                    >
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

                <aside class="my-4 mx-2 bg-[rgba(43,45,48,0.8)] p-3 border-l-4 border-[#e05d2d]">
                    <p>Не забывайте о html тегах по типу &lt;strong&gt;.</p>
                </aside>

                <div class="font-['Arial','sans-serif'] leading-relaxed w-full overflow-x-auto">
                    <ul class="list-disc pl-5 space-y-2">
                        <li v-for="note in notesText" :key="note.id">{{ note }}</li>
                    </ul>
                </div>
            </section>

            <footer class="p-4 m-0 text-center border-t border-[#5c5c5c]">
                <p>Автор статьи: неизвестный знаток.</p>
            </footer>
        </article>

        <aside
            class="bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] m-2 flex flex-col min-w-[20%] flex-grow overflow-hidden max-w-[25%]"
        >
            <section class="h-full">
                <h3
                    class="bg-[#18191a] m-0 p-4 min-h-[3em] border-b border-[#5c5c5c] flex items-center justify-center text-center"
                >
                    Категории
                </h3>
                <ul class="p-0 m-0 text-center">
                    <li
                        v-for="route in navRoutes"
                        :key="route.id"
                        class="border-b border-[#5c5c5c] py-3 px-4"
                    >
                        <RouterLink
                            v-if="route.isRoute"
                            :to="route.link"
                            class="text-white no-underline relative hover:text-[#e05d2d] transition-colors duration-300 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e05d2d] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                        >
                            {{ route.text }}
                        </RouterLink>
                        <a
                            v-else
                            :href="route.link"
                            class="text-white no-underline relative hover:text-[#e05d2d] transition-colors duration-300 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e05d2d] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                        >
                            {{ route.text }}
                        </a>
                    </li>
                </ul>
            </section>
        </aside>
    </main>
</template>

<style scoped>
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
    font-weight: 600;
}

.light {
    font-style: normal;
    font-weight: 300;
}
</style>
