<script setup>
import { useStudyStore } from '@/stores/study';

const studyStore = useStudyStore();
const { tableOne, tableTwo } = studyStore;
</script>

<template>
    <main>
        <section class="mainTheme">
            <h2>Информация об учебе</h2>
            <p>
                Полное название университета: ФГАОУ ВО «СЕВАСТОПОЛЬСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ»
            </p>
            <p>Полное название кафедры: Информационные системы</p>

            <h3>Перечень изучаемых дисциплин</h3>
        </section>
        <section class="table-container">
            <div class="category-table">
                <!-- Заголовок таблицы -->
                <div class="th-width">
                    <div class="table-header">
                        <div class="table-cell width-number">№</div>
                        <div class="table-cell width-subject">Дисциплина</div>
                        <div class="th-height">
                            <div class="table-h">Часов в неделю (Лекций, Лаб.раб, Практ. раб)</div>
                            <div class="table-header">
                                <div class="table-cell">1 курс</div>
                                <div class="table-cell">2 курс</div>
                            </div>
                            <div class="table-header">
                                <div v-for="semester in 4" :key="semester" class="table-cell">
                                    {{ semester }} сем
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Данные таблицы -->
                <div v-for="(row, index) in tableOne.rows" :key="row.id" class="table-row">
                    <div class="table-cell width-number">{{ index + 1 }}</div>
                    <div class="table-cell width-subject">{{ row.subject }}</div>

                    <template v-for="semesterData in row.semesters" :key="semesterData.semester">
                        <div
                            v-for="(value, typeIndex) in semesterData.data"
                            :key="typeIndex"
                            class="data-cell"
                            :data-label="`${semesterData.semester} сем`"
                        >
                            {{ value !== null ? value : '' }}
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <section class="table-wrap">
            <table class="plan" aria-label="План учебного процесса">
                <thead>
                    <tr class="title-row">
                        <th colspan="9">ПЛАН УЧЕБНОГО ПРОЦЕССА</th>
                    </tr>
                    <tr>
                        <th class="col-number" rowspan="2">№</th>
                        <th class="col-discipline" rowspan="2">Дисциплина</th>
                        <th class="col-dept" rowspan="2">Кафедра</th>
                        <th colspan="6">Всего часов</th>
                    </tr>
                    <tr>
                        <th>Всего</th>
                        <th>Ауд</th>
                        <th>Лк</th>
                        <th>Лб</th>
                        <th>Пр</th>
                        <th>СРС</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in tableTwo.rows" :key="row.id">
                        <td>{{ index + 1 }}</td>
                        <td class="col-discipline">{{ row.subject }}</td>
                        <td>{{ row.department }}</td>
                        <td>{{ row.hours.total }}</td>
                        <td>{{ row.hours.auditory }}</td>
                        <td>{{ row.hours.lectures }}</td>
                        <td>{{ row.hours.labs }}</td>
                        <td>{{ row.hours.practical }}</td>
                        <td>{{ row.hours.selfStudy }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>

<style scoped></style>
