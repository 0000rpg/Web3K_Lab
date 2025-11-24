<script setup>
import { useAutoWriterStore } from '@/stores/main-page-writer';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

const mainStore = useMainStore();
const autoWriterStore = useAutoWriterStore();
const { userInfo, studyTable, notes } = storeToRefs(mainStore);

const pageDescriptionElement = ref(null);
let cleanupFunction = null;

onMounted(() => {
    if (pageDescriptionElement.value) {
        cleanupFunction = autoWriterStore.setupAutoWriter(pageDescriptionElement.value);
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
        class="flex flex-row flex-wrap min-w-[70%] min-h-[70vh] justify-center lg:max-w-[80%] text-white items-center"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Информация о пользователе
            </h2>
            <div class="p-4">
                <div class="horizontal-container flex flex-row m-4 border-b border-[#5c5c5c]">
                    <div
                        v-for="container in userInfo"
                        :key="container.id"
                        :class="container.class"
                        class="flex-grow"
                    >
                        <template v-for="field in container.items" :key="field.id">
                            <h3 v-if="field.name" class="border-y border-[#5c5c5c] py-2 text-white">
                                {{ field.name }}
                            </h3>
                            <template v-if="field.name">
                                <p
                                    v-for="fieldDescription in field.text"
                                    :key="fieldDescription.id"
                                    :class="field.class"
                                    class="text-start p-2 text-base text-white"
                                >
                                    {{ fieldDescription }}
                                </p>
                            </template>
                            <img
                                v-if="field.src"
                                :src="field.src"
                                :alt="field.alt"
                                :class="field.class"
                                class="w-3/5 min-w-[100px] aspect-square m-2 object-cover bg-cover"
                            />
                        </template>
                    </div>
                </div>
                <p class="text-white text-center">Немного информации о себе:</p>
                <p
                    ref="pageDescriptionElement"
                    id="page-description"
                    class="text-justify leading-relaxed text-base p-4 text-white"
                >
                    Наведите курсор для генерации описания...
                </p>
                <p class="text-white text-center">
                    Описание будет создано автоматически при наведении курсора.
                </p>
            </div>
        </section>

        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Предстоящие работы
            </h2>
            <div class="p-4">
                <div class="table-container m-4">
                    <h3 class="mb-6 text-[#ed6c21] text-center">
                        Таблица предстоящих лабораторных работ
                    </h3>
                    <p class="description text-center mb-8 text-[#757575]">
                        Состояние на 13.09.2025
                    </p>
                    <div class="border border-[#5c5c5c] rounded-[2em] overflow-hidden w-full">
                        <!-- Заголовок таблицы -->
                        <div
                            class="bg-[#ed6c21] text-white font-semibold grid grid-cols-4 w-full border-r border-[#5c5c5c] last:border-r-0"
                        >
                            <div
                                v-for="headName in studyTable.head"
                                :key="headName.id"
                                class="p-4 border-r border-[#5c5c5c] last:border-r-0 text-center"
                            >
                                {{ headName }}
                            </div>
                        </div>

                        <!-- Тело таблицы -->
                        <div class="w-full">
                            <template v-for="category in studyTable.categories" :key="category.id">
                                <!-- Заголовок категории -->
                                <div
                                    class="bg-[rgba(47,49,53,0.4)] font-bold text-[#ed6c21] grid grid-cols-4 w-full border-b border-t border-[#5c5c5c] last:border-r-0"
                                >
                                    <div class="p-4 text-start text-lg col-span-4">
                                        {{ category.name }}
                                    </div>
                                </div>

                                <!-- Строки категории -->
                                <div
                                    v-for="row in category.content"
                                    :key="row.id"
                                    class="grid grid-cols-4 border-b border-[#5c5c5c] even:bg-[rgba(45,47,51,0.8)] w-full"
                                >
                                    <div
                                        v-for="content in row"
                                        :key="content.id"
                                        class="p-4 border-r border-[#5c5c5c] last:border-r-0 text-center"
                                    >
                                        {{ content.text }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div
                        class="note bg-[rgba(34,36,39,0.8)] p-6 rounded-lg mt-8 border-l-4 border-[#ed6c21]"
                    >
                        <template v-for="note in notes" :key="note.id">
                            <h3 v-if="note.header" class="text-[#ed6c21] mb-2">
                                {{ note.header }}
                            </h3>
                            <p v-else class="text-white">{{ note.text }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
