<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Реактивные данные
const timeTable = ref({
    date: '06',
    month: 'Январь',
    year: '2020',
    time: '01:01:01',
    sumDate: '',
    second: 0,
});

const isModalOpen = ref(false);
const popupTimer = ref(10);
const modalPosition = ref({ top: 0, left: 0 });
const isHoveringNav = ref(false);
const isHoveringModal = ref(false);

// Навигационные данные
const navButtons = ref([
    { path: '/main', name: 'Главная страница' },
    { path: '/about', name: 'Обо мне' },
    { path: '/hobby', name: 'Мои интересы', hasModal: true },
    { path: '/study', name: 'Учёба' },
    { path: '/album', name: 'Фотоальбом' },
    { path: '/contacts', name: 'Контакты' },
    { path: '/math', name: 'Тест по высшей математике' },
]);

const hobbyAnchors = ref([
    { name: 'Увлечения', anchor: '#hobby' },
    { name: 'Литература', anchor: '#books' },
    { name: 'Музыка', anchor: '#music' },
    { name: 'Фильмы', anchor: '#movies' },
]);

// Вычисляемые свойства
const isHomePage = computed(() => route.path === '/');

// Методы
function updateClock() {
    const time = new Date();
    const year = time.getFullYear();
    let month = time.getMonth();
    const date = time.getDate();
    const hour = String(time.getHours()).padStart(2, '0');
    const minute = String(time.getMinutes()).padStart(2, '0');
    const second = String(time.getSeconds()).padStart(2, '0');

    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    timeTable.value = {
        date,
        month: months[month],
        year,
        time: `${hour}:${minute}:${second}`,
        sumDate: `${date}, ${months[month]} ${year}г.`,
        second,
    };
}

function headerScroll(e) {
    if (e.deltaY !== 0) {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
    }
    updateModalPosition();
}

function handleHobbyClick(e, button) {
    if (button.hasModal) {
        popupTimer.value = 10;
        if (isModalOpen.value == false) {
            toggleModal(e.target);
        }
    }
}

function triggerCloseModal() {
    if (popupTimer.value <= 0) {
        closeModal();
    } else {
        popupTimer.value--;
    }
}

function toggleModal(element) {
    if (!element) return;

    isModalOpen.value = !isModalOpen.value;
    if (isModalOpen.value) {
        const rect = element.getBoundingClientRect();
        modalPosition.value = {
            top: rect.bottom + 9,
            left: rect.left - 12,
        };
    }
}

function closeModal() {
    popupTimer.value = 0;
    isModalOpen.value = false;
}

function navigateToAnchor(anchor) {
    closeModal();
    // Если мы уже на странице хобби, просто скроллим к якорю
    if (route.path === '/hobby') {
        const element = document.querySelector(anchor);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Иначе переходим на страницу хобби с якорем
        router.push(`/hobby${anchor}`);
    }
}

function updateModalPosition() {
    if (isModalOpen.value) {
        const element = document.querySelector('li > a[href="/hobby"]');
        if (element) {
            const rect = element.getBoundingClientRect();
            modalPosition.value = {
                top: rect.bottom + 9,
                left: rect.left - 12,
            };
        }
    }
}

// Проверка, находится ли курсор над навигацией или модальным окном
function checkHoverState() {
    if (!isHoveringNav.value && !isHoveringModal.value) {
        closeModal();
    }
}

// Обработчики для навигации
function handleNavMouseEnter() {
    isHoveringNav.value = true;
}

function handleNavMouseLeave() {
    isHoveringNav.value = false;
    // Используем setTimeout чтобы дать время на переход между элементами
    setTimeout(checkHoverState, 100);
}

// Обработчики для модального окна
function handleModalMouseEnter() {
    isHoveringModal.value = true;
}

function handleModalMouseLeave() {
    isHoveringModal.value = false;
    // Используем setTimeout чтобы дать время на переход между элементами
    setTimeout(checkHoverState, 100);
}

// Хуки жизненного цикла
onMounted(() => {
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    const closeModalInterval = setInterval(triggerCloseModal, 1000);

    window.addEventListener('resize', updateModalPosition);
    window.addEventListener('scroll', updateModalPosition);

    onUnmounted(() => {
        clearInterval(clockInterval);
        clearInterval(closeModalInterval);
        window.removeEventListener('resize', updateModalPosition);
        window.removeEventListener('scroll', updateModalPosition);
    });
});
</script>

<template>
    <nav class="flex items-center justify-center">
        <RouterLink
            to="/"
            class="headLogo"
            :class="{
                headLogoActive: isHomePage,
                'text-[#ed6c21] hover:text-[#ed6c21]': isHomePage,
            }"
            @wheel="headerScroll"
        />
        <ul
            @mouseenter="handleNavMouseEnter"
            @mouseleave="handleNavMouseLeave"
            class="flex flex-row flex-nowrap justify-between overflow-x-auto overflow-y-hidden mt-2 list-none p-0 m-0 box-border touch-pan-x scrollbar-orange z-100500"
        >
            <li
                v-for="button in navButtons"
                :key="button.path"
                class="mx-2 my-0.5 px-2 py-0.5 rounded text-xl whitespace-nowrap overflow-ellipsis"
            >
                <RouterLink
                    :to="button.path"
                    :class="{
                        'text-[#ed6c21] hover:text-[#ed6c21]': $route.path.includes(
                            button.path.replace('/', ''),
                        ),
                        'text-white hover:text-[#e05d2d]': !$route.path.includes(
                            button.path.replace('/', ''),
                        ),
                    }"
                    @click="(e) => button.hasModal && handleHobbyClick(e, button)"
                    @mouseover="(e) => button.hasModal && handleHobbyClick(e, button)"
                    class="no-underline relative transition-colors duration-300 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e05d2d] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                >
                    {{ button.name }}
                </RouterLink>
            </li>

            <div class="self-center whitespace-nowrap px-6 font-mono text-white">
                <p class="p-0 m-0">{{ timeTable.time }}</p>
                <p class="p-0 m-0">{{ timeTable.sumDate }}</p>
            </div>
        </ul>

        <!-- Модальное меню для хобби -->
        <ul
            v-show="isModalOpen"
            :style="{
                top: `${modalPosition.top}px`,
                left: `${modalPosition.left}px`,
            }"
            @mouseenter="handleModalMouseEnter"
            @mouseleave="handleModalMouseLeave"
            class="fixed flex flex-col pt-2 min-w-fit text-xl bg-[#18191a] border border-[#5c5c5c] border-t-0 rounded-b-xl mt-3 z-100499"
        >
            <li v-for="anchor in hobbyAnchors" :key="anchor.anchor" class="mx-2 my-0.5 px-2 py-0.5">
                <a
                    href="#"
                    @click.prevent="navigateToAnchor(anchor.anchor)"
                    class="text-white no-underline relative hover:text-[#e05d2d] transition-colors duration-300 after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e05d2d] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                >
                    {{ anchor.name }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<style>
.headLogo {
    mask-image: url('/src/assets/images/лого.svg');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: #e05d2d;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: #e05d2d;
    min-width: 40px;
}

.headLogoActive {
    mask-image: url('/src/assets/images/eye_logo.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: #e05d2d;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: #e05d2d;
    min-width: 40px;
}

/* Стили для оранжевого скроллбара */
.scrollbar-orange::-webkit-scrollbar {
    height: 6px;
}

.scrollbar-orange::-webkit-scrollbar-track {
    background: #18191a;
    border-radius: 10px;
}

.scrollbar-orange::-webkit-scrollbar-thumb {
    background: #e05d2d;
    border-radius: 10px;
}

.scrollbar-orange::-webkit-scrollbar-thumb:hover {
    background: #ed6c21;
}

.scrollbar-orange {
    scrollbar-width: thin;
    scrollbar-color: #e05d2d #18191a;
}
</style>
