<script setup>
import { usePageTitle } from '@/stores/page-title';
import { storeToRefs } from 'pinia';

const pageTitleStore = usePageTitle();
const { pageH1 } = storeToRefs(pageTitleStore);
</script>

<template>
    <h1 v-if="pageH1" id="start" class="text-center mt-30 text-4xl text-white font-semibold">
        {{ pageH1 }}
    </h1>
</template>
