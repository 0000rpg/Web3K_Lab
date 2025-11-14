<script setup>
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();
const { userInfo, studyTable, notes } = storeToRefs(mainStore);
</script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Информация о пользователе</h2>
            <div class="horizontal-container">
                <div v-for="container in userInfo" :key="container.id" :class="container.class">
                    <template v-for="field in container.items" :key="field.id">
                        <h3 v-if="field.name">{{ field.name }}</h3>
                        <template v-if="field.name">
                            <p
                                v-for="fieldDescription in field.text"
                                :key="fieldDescription.id"
                                :class="field.class"
                            >
                                {{ fieldDescription }}
                            </p>
                        </template>
                        <img
                            v-if="field.src"
                            :src="field.src"
                            :alt="field.alt"
                            :class="field.class"
                        />
                    </template>
                </div>
            </div>
            <p>Немного информации о себе:</p>
            <p id="page-description">???</p>
            <p>Описание было создано самостоятельно при его поиске.</p>
        </section>
        <section>
            <h2>Предстоящие работы</h2>
            <div class="table-container">
                <h3>Таблица предстоящих лабораторных работ</h3>
                <p class="description">Состояние на 13.09.2025</p>

                <div class="category-table">
                    <div class="table-header">
                        <div
                            v-for="headName in studyTable.head"
                            :key="headName.id"
                            class="table-cell"
                        >
                            {{ headName }}
                        </div>
                    </div>
                    <template v-for="category in studyTable.categories" :key="category.id">
                        <div class="table-row category-header">
                            <div class="table-cell">{{ category.name }}</div>
                        </div>
                        <div v-for="row in category.content" :key="row.id" class="table-row">
                            <div
                                v-for="content in row"
                                :key="content.id"
                                :data-label="content.name"
                                class="table-cell"
                            >
                                {{ content.text }}
                            </div>
                        </div>
                    </template>
                </div>

                <div class="note">
                    <template v-for="note in notes" :key="note.id">
                        <h3 v-if="note.header">{{ note.header }}</h3>
                        <p v-else>{{ note.text }}</p>
                    </template>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped></style>
