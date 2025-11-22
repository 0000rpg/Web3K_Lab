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
    <main
        class="flex flex-row flex-wrap items-start min-w-full min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden text-center m-2 mt-8"
            id="trigger"
        >
            <h2 class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c]">
                Тест по высшей математике
            </h2>

            <!-- Скрытое поле с утверждением -->
            <input type="hidden" id="question-text" :value="statementText" />

            <FormGenerator :store="mathTestStore" />
        </section>
    </main>
</template>
