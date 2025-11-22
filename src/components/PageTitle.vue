<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const pageH1 = route.title || '';
console.log(route);
</script>

<template>
    <h1 id="start" class="text-center mt-30 text-4xl text-white font-semibold">
        {{ pageH1 }}
    </h1>
</template>
