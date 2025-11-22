<script setup>
import { useHistoryStore } from '@/stores/history';
import { onMounted } from 'vue';

const historyStore = useHistoryStore();

onMounted(() => {
    historyStore.loadFromStorage();
});
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-full min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Статистика просмотров страниц
            </h2>

            <div class="p-4 w-full">
                <!-- История текущего сеанса -->
                <h3 class="text-xl font-bold mb-4 text-white text-center">
                    История текущего сеанса
                </h3>
                <div class="w-full">
                    <div class="border border-[#5c5c5c] rounded-[2em] overflow-hidden w-full">
                        <!-- Заголовок таблицы -->
                        <div
                            class="bg-[#18191a] text-[#ed6c21] font-semibold grid grid-cols-2 w-full"
                        >
                            <div class="p-4 border-r border-[#5c5c5c] text-center">Страница</div>
                            <div class="p-4 text-center">Количество посещений</div>
                        </div>
                        <!-- Тело таблицы -->
                        <div class="w-full">
                            <div
                                v-for="item in historyStore.sessionHistory"
                                :key="item.page"
                                class="grid grid-cols-2 border-b border-[#5c5c5c] even:bg-[rgba(45,47,51,0.8)] w-full"
                            >
                                <div class="p-4 border-r border-[#5c5c5c] text-center">
                                    {{ item.title }}
                                </div>
                                <div class="p-4 text-center">
                                    {{ item.count }}
                                </div>
                            </div>
                            <div
                                v-if="historyStore.sessionHistory.length === 0"
                                class="border-b border-[#5c5c5c] w-full"
                            >
                                <div class="p-4 text-center col-span-2">
                                    Нет данных о просмотрах в текущем сеансе
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- История за все время -->
                <h3 class="text-xl font-bold my-4 text-white text-center">История за все время</h3>
                <div class="w-full">
                    <div class="border border-[#5c5c5c] rounded-[2em] overflow-hidden w-full">
                        <!-- Заголовок таблицы -->
                        <div
                            class="bg-[#18191a] text-[#ed6c21] font-semibold grid grid-cols-2 w-full"
                        >
                            <div class="p-4 border-r border-[#5c5c5c] text-center">Страница</div>
                            <div class="p-4 text-center">Количество посещений</div>
                        </div>
                        <!-- Тело таблицы -->
                        <div class="w-full">
                            <div
                                v-for="item in historyStore.allTimeHistory"
                                :key="item.page"
                                class="grid grid-cols-2 border-b border-[#5c5c5c] even:bg-[rgba(45,47,51,0.8)] w-full"
                            >
                                <div class="p-4 border-r border-[#5c5c5c] text-center">
                                    {{ item.title }}
                                </div>
                                <div class="p-4 text-center">
                                    {{ item.count }}
                                </div>
                            </div>
                            <div
                                v-if="historyStore.allTimeHistory.length === 0"
                                class="border-b border-[#5c5c5c] w-full"
                            >
                                <div class="p-4 text-center col-span-2">
                                    Нет данных о просмотрах за все время
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Кнопки управления -->
                <div class="flex gap-4 mt-8 justify-center flex-wrap w-full">
                    <button
                        @click="historyStore.clearSessionHistory()"
                        class="bg-[#ed6c21] text-white border-none rounded-[0.75em] py-3 px-6 font-bold cursor-pointer transition-all duration-300 hover:bg-[#e05d2d] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(237,108,33,0.3)]"
                    >
                        Очистить историю сеанса
                    </button>
                    <button
                        @click="historyStore.clearAllTimeHistory()"
                        class="bg-[#ed6c21] text-white border-none rounded-[0.75em] py-3 px-6 font-bold cursor-pointer transition-all duration-300 hover:bg-[#e05d2d] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(237,108,33,0.3)]"
                    >
                        Очистить всю историю
                    </button>
                </div>
            </div>
        </section>
    </main>
</template>
