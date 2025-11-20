<script setup>
import FormGenerator from '@/components/FormGenerator.vue';
import { useMathTest } from '@/stores/mathTest';
import { onMounted, ref } from 'vue';

const mathTestStore = useMathTest();
const statementText = ref('Производная константы всегда равна нулю');

onMounted(() => {
    // Устанавливаем текст утверждения для вопроса 4
    const questionTextElement = document.getElementById('question-text');
    if (questionTextElement) {
        questionTextElement.value = statementText.value;
    }
});
</script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme" id="trigger">
            <h2>Тест по высшей математике</h2>

            <!-- Скрытое поле с утверждением -->
            <input type="hidden" id="question-text" :value="statementText" />

            <FormGenerator :store="mathTestStore" />
        </section>
    </main>
</template>
