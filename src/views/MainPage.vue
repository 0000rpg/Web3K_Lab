<script setup>
import { useMainStore } from '../stores/main.js';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

const mainStore = useMainStore();
const { userInfo, studyTable, notes } = storeToRefs(mainStore);

const pageDescriptionElement = ref(null);
let isGenerated = false;

const handleMouseOver = async () => {
    if (isGenerated) return;

    isGenerated = true;

    try {
        const API_KEY = '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';
        const prompt =
            'Описание принципа работы событий DOM. Ответ должен быть кратким, информативным и на русском языке.';

        const requestBody = {
            model: 'openai/gpt-oss-20b:free',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        };

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        const readChunk = () => {
            reader
                .read()
                .then(({ done, value }) => {
                    if (done) return;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.replace('data: ', '').trim();
                            if (data === '[DONE]') return;

                            try {
                                const json = JSON.parse(data);
                                const delta = json.choices[0]?.delta?.content;
                                if (delta && pageDescriptionElement.value) {
                                    // заменяем \n на <br> прямо при выводе как в старой реализации
                                    pageDescriptionElement.value.innerHTML += delta.replace(
                                        /\n/g,
                                        '<br>',
                                    );
                                }
                            } catch (e) {
                                console.error('Ошибка парсинга:', e, line);
                            }
                        }
                    }

                    readChunk(); // читаем дальше
                })
                .catch((error) => {
                    console.error('Ошибка чтения:', error);
                });
        };

        readChunk();
    } catch (error) {
        console.error('Ошибка генерации текста:', error);
        if (pageDescriptionElement.value) {
            pageDescriptionElement.value.textContent =
                'Не удалось сгенерировать описание. Ошибка: ' + error.message;
        }
    }
};

onMounted(() => {
    if (pageDescriptionElement.value) {
        pageDescriptionElement.value.addEventListener('mouseover', handleMouseOver);
    }
});

onUnmounted(() => {
    if (pageDescriptionElement.value) {
        pageDescriptionElement.value.removeEventListener('mouseover', handleMouseOver);
    }
});
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
            <p ref="pageDescriptionElement" id="page-description">???</p>
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
