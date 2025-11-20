import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAboutMeStore = defineStore('aboutMe', () => {
    const autoBiography = ref([]);

    return {};
});
