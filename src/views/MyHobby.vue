<script setup>
import { useHobbyStore } from '@/stores/myHobby';
import { storeToRefs } from 'pinia';

const hobbyStore = useHobbyStore();
const { hobbySections, categories } = storeToRefs(hobbyStore);
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-full min-h-[70vh] justify-center lg:max-w-[80%] text-white mt-20"
    >
        <section
            class="min-w-[60%] lg:max-w-[60%] bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Мои увлечения
            </h2>
            <div class="p-4">
                <article
                    v-for="section in hobbySections"
                    :key="section.id"
                    class="mb-8 last:mb-0"
                    :id="section.id"
                >
                    <h3 class="text-[#ed6c21] text-xl font-bold mb-4">{{ section.title }}</h3>
                    <div
                        v-if="section.type === 'textWithImage'"
                        class="horizontal-container flex flex-row m-4"
                    >
                        <div class="flex-grow">
                            <p
                                v-for="(paragraph, idx) in section.content.paragraphs"
                                :key="idx"
                                class="text-white py-1"
                            >
                                {{ paragraph }}
                            </p>
                        </div>
                        <div class="flex-shrink-0">
                            <img
                                :src="section.content.image.src"
                                :class="section.content.image.class"
                                class="max-w-[50%] rounded-[2em] max-h-[15em] border border-[#5c5c5c]"
                            />
                        </div>
                    </div>
                    <div
                        v-if="section.type === 'gallery'"
                        class="flex flex-wrap justify-center gap-4"
                    >
                        <figure
                            v-for="item in section.content.items"
                            :key="item.caption"
                            class="bg-[rgba(43,45,48,0.8)] p-4 rounded-2xl border border-[#5c5c5c] flex flex-col items-center transition-all duration-200 hover:scale-105"
                        >
                            <img
                                :src="item.image.src"
                                :class="item.image.class"
                                class="w-full max-w-[200px] h-auto object-contain mb-2"
                            />
                            <figcaption class="text-white text-center mt-2">
                                {{ item.caption }}
                            </figcaption>
                        </figure>
                    </div>
                    <div v-if="section.type === 'list'">
                        <ul class="list-none pl-0">
                            <li
                                v-for="(item, idx) in section.content.items"
                                :key="idx"
                                class="text-white py-1 before:content-['–'] before:mr-2"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </article>
            </div>
        </section>

        <!-- Боковая панель -->
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
                        v-for="category in categories"
                        :key="category.id"
                        class="border-b border-[#5c5c5c] py-3 px-4"
                    >
                        <a
                            :href="category.link"
                            class="text-white no-underline relative hover:text-[#e05d2d] transition-colors duration-300 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e05d2d] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                        >
                            {{ category.title }}
                        </a>
                    </li>
                </ul>
            </section>
        </aside>
    </main>
</template>

<style scoped>
.horizontal-container {
    border-bottom: 1px solid #5c5c5c;
    border-top: 1px solid #5c5c5c;
    padding: 1em 0;
}

.img-50 {
    max-width: 50%;
    border-radius: 2em;
    max-height: 15em;
    border: 1px solid #5c5c5c;
}
</style>
