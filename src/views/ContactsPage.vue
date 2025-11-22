<script setup>
import FormGenerator from '@/components/FormGenerator.vue';
import { useContactsStore } from '@/stores/contacts';

const contactsStore = useContactsStore();
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-full min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden text-center m-2 mt-8"
            id="trigger"
        >
            <h2 class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c]">Свяжитесь со мной</h2>
            <FormGenerator :store="contactsStore" />
        </section>
    </main>
</template>
