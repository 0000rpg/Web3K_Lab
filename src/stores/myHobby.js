import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHobbyStore = defineStore('hobby', () => {
    const hobbySections = ref([
        {
            id: 'hobby',
            type: 'textWithImage',
            title: 'Мои увлечения',
            content: {
                paragraphs: [
                    'В свободное время я увлекаюсь программированием, чтением технической литературы и изучением новых технологий.',
                    'Также люблю активный отдых - велосипедные прогулки и походы в горы.',
                    'Особое место занимает 3д печать - лучшее занятие для изучения многих интересных областей знаний.',
                ],
                image: {
                    src: 'src/assets/images/hobby/printer.jpg',
                    class: 'img-50',
                },
            },
        },
        {
            id: 'literature',
            type: 'list',
            title: 'Любимые жанры литературы:',
            content: {
                items: [
                    'Научная фантастика',
                    'Антиутопии',
                    'Современная русская проза',
                    'Фантастические романы',
                ],
            },
        },
        {
            id: 'books',
            type: 'gallery',
            title: 'Любимые книги',
            content: {
                items: [
                    {
                        image: {
                            src: 'src/assets/images/hobby/Азимов.jpg',
                            class: 'img-50',
                        },
                        caption: 'Цикл произведений "Галактическая история" – Айзек Азимов',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Гаррисон.jpg',
                            class: 'img-50',
                        },
                        caption: '"Война роботов" – Гарри Гаррисон',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Полковник.jpg',
                            class: 'img-50',
                        },
                        caption: '"Полковник Никто" – Алексей Суконин',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Деривация.jpg',
                            class: 'img-50',
                        },
                        caption: '"Деривация" – Алексей Суконин',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Пикник.jpg',
                            class: 'img-50',
                        },
                        caption: '"Пикник на обочине" – братья Стругацкие',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/1984.webp',
                            class: 'img-50',
                        },
                        caption: '"1984" – Джордж Оруэлл',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Пелевин.jpg',
                            class: 'img-50',
                        },
                        caption: '"Ананасная вода для прекрасной дамы" – Виктор Пелевин',
                    },
                ],
            },
        },
        {
            id: 'music',
            type: 'gallery',
            title: 'Любимая музыка',
            content: {
                items: [
                    {
                        image: {
                            src: 'src/assets/images/hobby/rammstein.webp',
                            class: 'img-50',
                        },
                        caption: 'Rammstein',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/КИШ.webp',
                            class: 'img-50',
                        },
                        caption: 'КИШ',
                    },
                    {
                        image: {
                            src: 'src/assets/images/hobby/Пламенев.jpg',
                            class: 'img-50',
                        },
                        caption: 'Группа Павла Пламенева',
                    },
                ],
            },
        },
        {
            id: 'movies',
            type: 'list',
            title: 'Любимые фильмы',
            content: {
                items: [
                    'Научная фантастика: "Матрица", "Интерстеллар"',
                    'Фэнтези: "Властелин колец"',
                    'Драма: "Побег из Шоушенка"',
                    'Боевик: "Солнцепёк", "Лучшие в аду", "Турист"',
                ],
            },
        },
    ]);

    const categories = ref([
        { id: 1, title: 'Моё хобби', link: '#hobby' },
        { id: 2, title: 'Любимые книги', link: '#books' },
        { id: 3, title: 'Любимая музыка', link: '#music' },
        { id: 4, title: 'Любимые фильмы', link: '#movies' },
    ]);

    return { hobbySections, categories };
});
