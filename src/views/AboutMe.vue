<script setup>
import { useAboutMeStore } from '@/stores/aboutMe';
import { useAboutMeAutoWriterStore } from '@/stores/about-me-writer';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

const aboutMeStore = useAboutMeStore();
const aboutMeAutoWriterStore = useAboutMeAutoWriterStore();
const { articles, autoBiography } = storeToRefs(aboutMeStore);

const pageAutoWriterElement = ref(null);
let cleanupFunction = null;

onMounted(() => {
    if (pageAutoWriterElement.value) {
        cleanupFunction = aboutMeAutoWriterStore.setupAutoWriter(pageAutoWriterElement.value);
    }
});

onUnmounted(() => {
    if (cleanupFunction) {
        cleanupFunction();
    }
});
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-[90%] min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white mt-20"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Автобиография
            </h2>
            <div class="p-4">
                <div
                    v-for="container in autoBiography"
                    :key="container.id"
                    class="horizontal-container flex flex-row m-4 border-b border-[#5c5c5c]"
                >
                    <div v-if="container.name" class="flex-grow">
                        <h3 v-if="container.name" class="border-y border-[#5c5c5c] py-2 text-white">
                            {{ container.name }}
                        </h3>
                        <template v-if="container.context">
                            <p
                                v-for="text in container.context"
                                :key="text.id"
                                class="text-white py-1"
                            >
                                {{ text }}
                            </p>
                        </template>
                        <ul
                            v-if="container.table"
                            class="list-none p-0 m-0 flex flex-row flex-wrap justify-between mt-2"
                        >
                            <li
                                v-for="cell in container.table"
                                :key="cell.id"
                                class="m-2 mx-2 my-1 px-2 py-1 rounded transition-all duration-200 hover:scale-110 flex items-center"
                            >
                                <img
                                    :id="cell.img.id"
                                    :src="cell.img.src"
                                    class="h-8 w-12 m-2 min-w-10"
                                />
                                <div class="text-white whitespace-nowrap overflow-ellipsis">
                                    {{ cell.text }}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-if="container.img" class="flex-shrink-0">
                        <img
                            src="../assets/images/user.png"
                            :class="container.img.class"
                            class="user-logo w-3/5 min-w-[100px] aspect-square m-2 object-cover bg-cover"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Интересные факты
            </h2>
            <div class="p-4">
                <div class="horizontal-container vertical flex flex-col space-y-6">
                    <section
                        v-for="article in articles"
                        :key="article.id"
                        class="bg-[rgba(43,45,48,0.8)] p-4 rounded-lg"
                    >
                        <h3 class="text-[#ed6c21] text-xl font-bold mb-3">{{ article.name }}</h3>
                        <p v-if="article.caption" class="text-white mb-4">{{ article.caption }}</p>
                        <div v-for="fact in article.facts" :key="fact.id" class="mb-4 last:mb-0">
                            <h4 class="text-[#e05d2d] font-semibold mb-2">{{ fact.name }}</h4>
                            <p class="text-white leading-relaxed">{{ fact.text }}</p>
                        </div>
                    </section>

                    <div class="bg-[rgba(43,45,48,0.8)] p-4 rounded-lg">
                        <h3 class="text-[#ed6c21] text-xl font-bold mb-3">IT</h3>
                        <div
                            ref="pageAutoWriterElement"
                            class="page-autowriter min-h-[200px] cursor-pointer p-4 border-2 border-dashed border-[#5c5c5c] rounded-lg hover:border-[#ed6c21] transition-colors duration-200 text-justify leading-relaxed text-base text-white"
                        >
                            ???
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.user-logo {
    height: 12em;
    width: 12em;
    margin: 0.5em;
    border-radius: 0.5em;
    object-fit: contain;
    padding: 0.5em;
    filter: invert(1);
}

#web-logo {
    height: 4em;
    width: 4em;
    margin: 0.5em;
    border-radius: 0.5em;
    object-fit: contain;
    padding: 0.5em;
    filter: invert(1);
}

#programming-logo {
    height: 4em;
    width: 4em;
    margin: 0.5em;
    border-radius: 0.5em;
    object-fit: contain;
    padding: 0.5em;
    filter: invert(1);
}

#admin-logo {
    height: 4em;
    width: 4em;
    margin: 0.5em;
    border-radius: 0.5em;
    object-fit: contain;
    padding: 0.5em;
    filter: invert(1);
}

#sql-logo {
    height: 4em;
    width: 4em;
    margin: 0.5em;
    border-radius: 0.5em;
    object-fit: contain;
    padding: 0.5em;
    filter: invert(1);
}
</style>
