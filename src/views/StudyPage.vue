<script setup>
import { useStudyStore } from '@/stores/study';

const studyStore = useStudyStore();
const { tableOne, tableTwo } = studyStore;
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-[90%] min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white mt-26"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Информация об учебе
            </h2>
            <div class="p-4">
                <p class="text-white mb-2">
                    Полное название университета: ФГАОУ ВО «СЕВАСТОПОЛЬСКИЙ ГОСУДАРСТВЕННЫЙ
                    УНИВЕРСИТЕТ»
                </p>
                <p class="text-white mb-4">Полное название кафедры: Информационные системы</p>
                <h3 class="text-[#ed6c21] text-xl font-bold">Перечень изучаемых дисциплин</h3>
            </div>
        </section>

        <!-- Первая таблица с grid layout -->
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Распределение часов по семестрам
            </h2>
            <div class="p-4">
                <div class="border border-[#5c5c5c] rounded-[2em] overflow-hidden w-full">
                    <!-- Заголовок таблицы -->
                    <div class="bg-[#ed6c21] text-white font-semibold grid grid-cols-12 w-full">
                        <div class="p-4 border-r border-[#5c5c5c] text-center col-span-1">№</div>
                        <div class="p-4 border-r border-[#5c5c5c] text-center col-span-3">
                            Дисциплина
                        </div>
                        <div class="p-2 border-r border-[#5c5c5c] text-center col-span-2 text-sm">
                            1 курс 1 сем
                        </div>
                        <div class="p-2 border-r border-[#5c5c5c] text-center col-span-2 text-sm">
                            1 курс 2 сем
                        </div>
                        <div class="p-2 border-r border-[#5c5c5c] text-center col-span-2 text-sm">
                            2 курс 3 сем
                        </div>
                        <div class="p-2 text-center col-span-2 text-sm">2 курс 4 сем</div>
                    </div>

                    <!-- Подзаголовок с типами занятий -->
                    <div
                        class="bg-[#e05d2d] text-white font-semibold grid grid-cols-12 w-full border-b border-[#5c5c5c]"
                    >
                        <div class="p-2 border-r border-[#5c5c5c] text-center col-span-4 text-sm">
                            Часов в неделю
                        </div>
                        <div class="p-1 border-r border-[#5c5c5c] text-center text-xs col-span-2">
                            Лек/Лаб/Прак
                        </div>
                        <div class="p-1 border-r border-[#5c5c5c] text-center text-xs col-span-2">
                            Лек/Лаб/Прак
                        </div>
                        <div class="p-1 border-r border-[#5c5c5c] text-center text-xs col-span-2">
                            Лек/Лаб/Прак
                        </div>
                        <div class="p-1 text-center text-xs col-span-2">Лек/Лаб/Прак</div>
                    </div>

                    <!-- Данные таблицы -->
                    <div class="w-full">
                        <div
                            v-for="(row, index) in tableOne.rows"
                            :key="row.id"
                            class="grid grid-cols-12 border-b border-[#5c5c5c] even:bg-[rgba(45,47,51,0.8)] w-full"
                        >
                            <div class="p-4 border-r border-[#5c5c5c] text-center col-span-1">
                                {{ index + 1 }}
                            </div>
                            <div class="p-4 border-r border-[#5c5c5c] text-left col-span-3">
                                {{ row.subject }}
                            </div>

                            <!-- Семестры -->
                            <template
                                v-for="semesterData in row.semesters"
                                :key="semesterData.semester"
                            >
                                <div
                                    v-for="(value, typeIndex) in semesterData.data"
                                    :key="typeIndex"
                                    class="p-2 border-r border-[#5c5c5c] last:border-r-0 text-center text-sm"
                                    :class="{
                                        'col-span-2': semesterData.data.length === 1,
                                        'col-span-1': semesterData.data.length > 1,
                                    }"
                                >
                                    {{ value !== null ? value : '' }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Вторая таблица -->
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                План учебного процесса
            </h2>
            <div class="p-4">
                <div class="overflow-x-auto border border-[#5c5c5c] rounded-[2em] w-full">
                    <table
                        class="w-full border-collapse max-w-[1100px] mx-auto text-sm table-fixed"
                        aria-label="План учебного процесса"
                    >
                        <thead>
                            <tr class="title-row">
                                <th
                                    colspan="9"
                                    class="border-none bg-transparent font-bold text-base p-1"
                                >
                                    ПЛАН УЧЕБНОГО ПРОЦЕССА
                                </th>
                            </tr>
                            <tr>
                                <th
                                    class="w-10 border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                    rowspan="2"
                                >
                                    №
                                </th>
                                <th
                                    class="w-[380px] border border-[#5c5c5c] p-2 align-middle text-left font-bold pl-2.5"
                                    rowspan="2"
                                >
                                    Дисциплина
                                </th>
                                <th
                                    class="w-20 border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                    rowspan="2"
                                >
                                    Кафедра
                                </th>
                                <th
                                    colspan="6"
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Всего часов
                                </th>
                            </tr>
                            <tr>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Всего
                                </th>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Ауд
                                </th>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Лк
                                </th>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Лб
                                </th>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    Пр
                                </th>
                                <th
                                    class="border border-[#5c5c5c] p-2 align-middle text-center font-bold"
                                >
                                    СРС
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in tableTwo.rows"
                                :key="row.id"
                                class="even:bg-[rgba(45,47,51,0.8)]"
                            >
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ index + 1 }}
                                </td>
                                <td
                                    class="border border-[#5c5c5c] p-2 align-middle text-left pl-2.5 break-words"
                                >
                                    {{ row.subject }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.department }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.total }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.auditory }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.lectures }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.labs }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.practical }}
                                </td>
                                <td class="border border-[#5c5c5c] p-2 align-middle text-center">
                                    {{ row.hours.selfStudy }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped></style>
