import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStudyStore = defineStore('studyPage', () => {
    const tableOne = ref({
        head: {},
        rows: [
            {
                id: 1,
                subject: 'Экология',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [1, 0, 1] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 2,
                subject: 'Высшая математика',
                semesters: [
                    { semester: 1, data: [3, 0, 3] },
                    { semester: 2, data: [3, 0, 3] },
                    { semester: 3, data: [2, 0, 2] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 3,
                subject: 'Русский язык и культура речи',
                semesters: [
                    { semester: 1, data: [1, 0, 2] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [null, null, null] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 4,
                subject: 'Основы дискретной математики',
                semesters: [
                    { semester: 1, data: [2, 0, 1] },
                    { semester: 2, data: [3, 0, 2] },
                    { semester: 3, data: [null, null, null] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 5,
                subject: 'Основы программирования и алгоритмические языки',
                semesters: [
                    { semester: 1, data: [3, 2, 0] },
                    { semester: 2, data: [3, 3, 0] },
                    { semester: 3, data: [0, 0, 1] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 6,
                subject: 'Основы экологии',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [1, 0, 0] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 7,
                subject: 'Теория вероятностей и математическая статистика',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [3, 1, 0] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 8,
                subject: 'Физика',
                semesters: [
                    { semester: 1, data: [2, 2, 0] },
                    { semester: 2, data: [2, 2, 0] },
                    { semester: 3, data: [2, 1, 0] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 9,
                subject: 'Основы электропитания и электроники',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [2, 1, 1] },
                    { semester: 4, data: [null, null, null] },
                ],
            },
            {
                id: 10,
                subject: 'Численные методы в информатике',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [2, 2, 0] },
                    { semester: 4, data: [0, 0, 1] },
                ],
            },
            {
                id: 11,
                subject: 'Методы исследования операций',
                semesters: [
                    { semester: 1, data: [null, null, null] },
                    { semester: 2, data: [null, null, null] },
                    { semester: 3, data: [1, 1, 0] },
                    { semester: 4, data: [2, 1, 1] },
                ],
            },
        ],
    });

    const tableTwo = ref({
        rows: [
            {
                id: 1,
                subject: 'Экология',
                department: 'БЖ',
                hours: {
                    total: 54,
                    auditory: 27,
                    lectures: 18,
                    labs: 0,
                    practical: 9,
                    selfStudy: 27,
                },
            },
            {
                id: 2,
                subject: 'Высшая математика',
                department: 'ВМ',
                hours: {
                    total: 540,
                    auditory: 282,
                    lectures: 141,
                    labs: 0,
                    practical: 141,
                    selfStudy: 258,
                },
            },
            {
                id: 3,
                subject: 'Русский язык и культура речи',
                department: 'НГиГ',
                hours: {
                    total: 108,
                    auditory: 54,
                    lectures: 18,
                    labs: 0,
                    practical: 36,
                    selfStudy: 54,
                },
            },
            {
                id: 4,
                subject: 'Основы дискретной математики',
                department: 'ИС',
                hours: {
                    total: 216,
                    auditory: 139,
                    lectures: 87,
                    labs: 0,
                    practical: 52,
                    selfStudy: 77,
                },
            },
            {
                id: 5,
                subject: 'Основы программирования и алгоритмические языки',
                department: 'ИС',
                hours: {
                    total: 405,
                    auditory: 210,
                    lectures: 105,
                    labs: 87,
                    practical: 18,
                    selfStudy: 195,
                },
            },
            {
                id: 6,
                subject: 'Основы экологии',
                department: 'ПЭОП',
                hours: {
                    total: 54,
                    auditory: 27,
                    lectures: 18,
                    labs: 0,
                    practical: 9,
                    selfStudy: 27,
                },
            },
            {
                id: 7,
                subject: 'Теория вероятностей и математическая статистика',
                department: 'ИС',
                hours: {
                    total: 162,
                    auditory: 72,
                    lectures: 54,
                    labs: 18,
                    practical: 0,
                    selfStudy: 90,
                },
            },
            {
                id: 8,
                subject: 'Физика',
                department: 'Физики',
                hours: {
                    total: 324,
                    auditory: 194,
                    lectures: 106,
                    labs: 88,
                    practical: 0,
                    selfStudy: 130,
                },
            },
            {
                id: 9,
                subject: 'Основы электротехники и электроники',
                department: 'ИС',
                hours: {
                    total: 108,
                    auditory: 72,
                    lectures: 36,
                    labs: 18,
                    practical: 18,
                    selfStudy: 36,
                },
            },
            {
                id: 10,
                subject: 'Численные методы в информатике',
                department: 'ИС',
                hours: {
                    total: 189,
                    auditory: 89,
                    lectures: 36,
                    labs: 36,
                    practical: 17,
                    selfStudy: 100,
                },
            },
            {
                id: 11,
                subject: 'Методы исследования операций',
                department: 'ИС',
                hours: {
                    total: 216,
                    auditory: 104,
                    lectures: 52,
                    labs: 35,
                    practical: 17,
                    selfStudy: 112,
                },
            },
        ],
    });

    return { tableOne, tableTwo };
});
