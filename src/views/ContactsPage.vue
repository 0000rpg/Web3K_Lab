<script setup>
import FormGenerator from '@/components/FormGenerator.vue';
import { useContactsStore } from '@/stores/contacts';

const contactsStore = useContactsStore();
</script>

<template>
    <main>
        <section class="mainTheme">
            <h2>Свяжитесь со мной</h2>
            <FormGenerator :store="contactsStore" />
        </section>
    </main>
</template>
