import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePhotoAlbum = defineStore('photoAlbum', () => {
    const imagesContainer = ref([
        {
            title: 'Природа',
            path: 'src/assets/images/album/Природа.jpg',
        },
        {
            title: 'Город',
            path: 'src/assets/images/album/Город.jpg',
        },
        {
            title: 'Путешествия',
            path: 'src/assets/images/album/Путешествия.jpg',
        },
        {
            title: 'Севгу',
            path: 'src/assets/images/album/Севгу.jpg',
        },
        {
            title: 'Катера',
            path: 'src/assets/images/album/Катера.jpg',
        },
        {
            title: 'Автобусы',
            path: 'src/assets/images/album/Автобусы.jpg',
        },
        {
            title: 'Дрон',
            path: 'src/assets/images/album/Дрон.jpg',
        },
        {
            title: 'Машина',
            path: 'src/assets/images/album/Машина.jpg',
        },
        {
            title: 'Лук',
            path: 'src/assets/images/album/Лук.jpeg',
        },
        {
            title: '3Д-печатная модель',
            path: 'src/assets/images/album/3Д-печатная модель.jpg',
        },
        {
            title: 'Мак',
            path: 'src/assets/images/album/Мак.jpg',
        },
        {
            title: 'Цветы',
            path: 'src/assets/images/album/Цветы.jpg',
        },
    ]);

    // Состояния для модального окна
    const showModal = ref(false);
    const currentImage = ref(null);
    const currentImageIndex = ref(0);

    function sortAsc() {
        imagesContainer.value = [...imagesContainer.value].sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }

    function sortDesc() {
        imagesContainer.value = [...imagesContainer.value].sort((a, b) =>
            b.title.localeCompare(a.title),
        );
    }

    function sortRandom() {
        imagesContainer.value = [...imagesContainer.value].sort(() => Math.random() - 0.5);
    }

    // Функции модального окна
    function openModal(image) {
        currentImage.value = image;
        currentImageIndex.value = imagesContainer.value.findIndex((img) => img.path === image.path);
        showModal.value = true;
    }

    function closeModal() {
        showModal.value = false;
        currentImage.value = null;
        currentImageIndex.value = 0;
    }

    function nextImage() {
        currentImageIndex.value = (currentImageIndex.value + 1) % imagesContainer.value.length;
        currentImage.value = imagesContainer.value[currentImageIndex.value];
    }

    function prevImage() {
        currentImageIndex.value =
            (currentImageIndex.value - 1 + imagesContainer.value.length) %
            imagesContainer.value.length;
        currentImage.value = imagesContainer.value[currentImageIndex.value];
    }

    function handleModalClick(event) {
        const modalContent = event.currentTarget;
        const rect = modalContent.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const xPercent = (clickX / rect.width) * 100;
        const yPercent = (clickY / rect.height) * 100;

        if (yPercent >= 20 && yPercent <= 80) {
            if (xPercent <= 20) {
                prevImage();
            } else if (xPercent >= 80) {
                nextImage();
            }
        }
        // Центральная область (20%-80%) не делает ничего
    }

    // Обработка клавиатуры
    function handleKeydown(event) {
        if (!showModal.value) return;

        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        }
    }

    return {
        imagesContainer,
        showModal,
        currentImage,
        sortAsc,
        sortDesc,
        sortRandom,
        openModal,
        closeModal,
        nextImage,
        prevImage,
        handleModalClick,
        handleKeydown,
    };
});
