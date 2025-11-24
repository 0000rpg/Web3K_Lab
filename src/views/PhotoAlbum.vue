<script setup>
import { usePhotoAlbum } from '@/stores/photoAlbum';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const photoAlbumStore = usePhotoAlbum();
const { imagesContainer, showModal, currentImage } = storeToRefs(photoAlbumStore);
const { sortAsc, sortDesc, sortRandom, openModal, closeModal, handleModalClick, handleKeydown } =
    photoAlbumStore;

// Обработка клавиатуры
onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <main
        class="flex flex-row flex-wrap items-start min-w-[90%] min-h-[70vh] justify-center lg:max-w-[80%] text-white"
    >
        <!-- Основная секция -->
        <section
            class="w-full bg-[rgba(34,36,39,0.8)] border border-[#5c5c5c] rounded-[2em] flex flex-col overflow-hidden m-2 text-white mt-20"
        >
            <h2
                class="w-full bg-[#18191a] p-4 m-0 border-b border-[#5c5c5c] text-white text-center"
            >
                Мой фотоальбом
            </h2>

            <div class="p-6">
                <p class="text-center text-[#b3b3b3] mb-6">Здесь собраны мои любимые фотографии</p>

                <!-- Кнопки сортировки -->
                <div class="flex justify-center gap-4 mb-8">
                    <button
                        @click="sortAsc"
                        class="bg-[#ed6c21] text-white px-6 py-2 rounded-lg border-0 transition-all duration-200 hover:bg-[#e05d2d] hover:scale-105 active:scale-95 active:bg-[#ff5e00]"
                    >
                        А-Я
                    </button>
                    <button
                        @click="sortDesc"
                        class="bg-[#ed6c21] text-white px-6 py-2 rounded-lg border-0 transition-all duration-200 hover:bg-[#e05d2d] hover:scale-105 active:scale-95 active:bg-[#ff5e00]"
                    >
                        Я-А
                    </button>
                    <button
                        @click="sortRandom"
                        class="bg-[#ed6c21] text-white px-6 py-2 rounded-lg border-0 transition-all duration-200 hover:bg-[#e05d2d] hover:scale-105 active:scale-95 active:bg-[#ff5e00]"
                    >
                        Случайно
                    </button>
                </div>

                <!-- Сетка фотографий -->
                <div class="photo-grid">
                    <figure
                        v-for="(photo, index) in imagesContainer"
                        :key="index"
                        class="bg-[rgba(43,45,48,0.8)] rounded-xl overflow-hidden border border-[#5c5c5c] transition-all duration-300 hover:scale-110 hover:border-[#ed6c21] cursor-pointer flex flex-col"
                    >
                        <img
                            :src="photo.path"
                            :alt="photo.title"
                            :title="photo.title"
                            @click="openModal(photo)"
                            class="w-full h-48 object-cover flex-grow"
                        />
                        <figcaption
                            class="bg-[#18191a] p-3 border-t border-[#5c5c5c] text-white text-center text-sm"
                        >
                            {{ photo.title }}
                        </figcaption>
                    </figure>
                </div>

                <!-- Ссылка возврата -->
                <div class="text-center mt-8">
                    <router-link
                        to="/"
                        class="text-[#ed6c21] no-underline hover:text-[#e05d2d] transition-colors duration-200"
                    >
                        Вернуться на главную страницу
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Модальное окно -->
        <div
            v-if="showModal"
            class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300 z-100501"
            @click="closeModal"
        >
            <!-- Кнопка закрытия -->
            <button
                class="fixed top-4 right-4 text-white text-4xl bg-transparent border-0 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 z-60"
                @click.stop="closeModal"
            >
                ×
            </button>

            <!-- Контент модального окна -->
            <div
                class="relative max-w-4xl max-h-[90vh] bg-transparent rounded-lg"
                @click.stop="handleModalClick"
            >
                <img
                    :src="currentImage?.path"
                    :alt="currentImage?.title"
                    class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />

                <!-- Заголовок изображения -->
                <p
                    class="text-white text-center mt-4 text-lg bg-[rgba(34,36,39,0.8)] p-3 rounded-lg border border-[#5c5c5c]"
                >
                    {{ currentImage?.title }}
                </p>
            </div>

            <!-- Фиксированные зоны навигации по бокам экрана -->
            <div
                class="fixed left-0 top-0 w-1/4 h-full cursor-pointer z-50 hover:bg-opacity-5 transition-colors duration-200 flex items-center justify-start select-none"
                @click.stop="handleModalClick"
            >
                <div
                    class="nav-indicator left-8 text-white text-6xl opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                    ‹
                </div>
            </div>
            <div
                class="fixed right-0 top-0 w-1/4 h-full cursor-pointer z-50 hover:bg-opacity-5 transition-colors duration-200 flex items-center justify-end select-none"
                @click.stop="handleModalClick"
            >
                <div
                    class="nav-indicator right-8 text-white text-6xl opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                    ›
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
}

@media (max-width: 768px) {
    .photo-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .photo-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

/* Анимации для модального окна */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
    transition: all 0.3s ease;
}

.modal-content-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-content-leave-to {
    opacity: 0;
    transform: scale(1.1);
}

/* Стили для навигационных индикаторов */
.nav-indicator {
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
    transition: all 0.3s ease;
}

/* Улучшенные hover-эффекты для навигационных зон */
.fixed.left-0:hover .nav-indicator,
.fixed.right-0:hover .nav-indicator {
    opacity: 1;
    transform: scale(1.2);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
    .fixed.left-0,
    .fixed.right-0 {
        width: 20%;
    }

    .nav-indicator {
        font-size: 4rem;
    }

    .fixed.left-0 .nav-indicator {
        left: 1rem;
    }

    .fixed.right-0 .nav-indicator {
        right: 1rem;
    }
}
</style>
