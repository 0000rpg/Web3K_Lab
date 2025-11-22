import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const usePageTitle = defineStore('pageTitle', () => {
    const route = useRoute();
    const pageTitle = ref('');
    const pageH1 = ref('');

    watch(
        route,
        (to) => {
            if (to.meta.title) {
                document.title = to.meta.title;
            }
            pageTitle.value = to.meta.title || '';
            pageH1.value = to.meta.h1 || to.meta.title || '';
        },
        { immediate: true },
    );

    return {
        pageTitle,
        pageH1,
    };
});
