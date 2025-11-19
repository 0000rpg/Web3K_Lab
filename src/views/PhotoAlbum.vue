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
    <main>
        <section class="mainTheme">
            <h2>Мой фотоальбом</h2>
            <p>Здесь собраны мои любимые фотографии</p>

            <div class="sort-buttons">
                <button @click="sortAsc">А-Я</button>
                <button @click="sortDesc">Я-А</button>
                <button @click="sortRandom">Случайно</button>
            </div>

            <div class="photo-grid">
                <figure v-for="(photo, index) in imagesContainer" :key="index">
                    <img
                        :src="photo.path"
                        :alt="photo.title"
                        :title="photo.title"
                        @click="openModal(photo)"
                    />
                    <figcaption>{{ photo.title }}</figcaption>
                </figure>
            </div>

            <!-- Модальное окно -->
            <div v-if="showModal" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop="handleModalClick">
                    <button class="close-btn" @click.stop="closeModal">×</button>
                    <img :src="currentImage?.path" :alt="currentImage?.title" />
                    <p class="image-title">{{ currentImage?.title }}</p>

                    <!-- Невидимые зоны для навигации -->
                    <div class="click-zone left-zone"></div>
                    <div class="click-zone right-zone"></div>
                </div>
            </div>

            <p><router-link to="/">Вернуться на главную страницу</router-link></p>
        </section>
    </main>
</template>

<style scoped>
:root {
    --theme: #ed6c21;
    --header: #18191a;
    --background: #1c1e21;
    --text: #f5f5f5;
    --snow: #ffffff;
    --border-accent: #757575;
    --border: #5c5c5c;
    --marker: #b3b3b3;
    --accent: #e05d2d;
    --section: rgba(34, 36, 39, 0.8);
    --aside-action: rgba(43, 45, 48, 0.8);
    --active-button: #ff5e00;
}

.photo-grid {
    figure {
        display: flex;
        flex-direction: column;
        border-radius: 0.5em;
        overflow: hidden;
        max-width: 22%;
        transition: all 0.3s ease;
    }
    figcaption {
        background-color: var(--background);
        border-bottom: 1px solid var(--border);
    }
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    align-content: flex-start;
    justify-content: flex-start;
    gap: 0.5em;
    margin: 0.5em 0;
    transition: all 0.3s ease;
    @media (max-width: 768px) {
        figure {
            max-width: 100%;
        }
    }
}

figure:hover {
    scale: 1.25;
}

.sort-buttons button {
    background-color: var(--theme);
    color: var(--snow);
    border: 0px;
    border-radius: 0.5em;
    width: fit-content;
    font-size: 0.8em;
    transition:
        transform 0.1s ease,
        background-color 0.2s ease;
    cursor: pointer;
}

.sort-buttons button:hover {
    background-color: var(--accent);
}

.sort-buttons button:active {
    transform: scale(0.95);
    background-color: var(--active-button);
}

/* Стили для модального окна просмотра изображений */
#imageModal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

#fullscreenImage {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    user-select: none;
}

#closeModal {
    position: absolute;
    top: 20px;
    right: 30px;
    color: white;
    font-size: 40px;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

#closeModal:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Анимация появления */
#imageModal {
    opacity: 0;
    transition: opacity 0.3s ease;
}

#imageModal[style*='display: flex'] {
    opacity: 1;
}

#fullscreenImage {
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

#imageModal[style*='display: flex'] #fullscreenImage {
    transform: scale(1);
}
</style>
