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
});

const isModalOpen = ref(false);
const modalPosition = ref({ top: 0, left: 0 });

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
        //e.preventDefault();
        toggleModal(e.target);
    }
}

function handleHobbyDblClick(button) {
    if (button.hasModal) {
        router.push(button.path);
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

// Хуки жизненного цикла
onMounted(() => {
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    window.addEventListener('resize', updateModalPosition);
    window.addEventListener('scroll', updateModalPosition);

    // Очистка при размонтировании компонента
    onUnmounted(() => {
        clearInterval(clockInterval);
        window.removeEventListener('resize', updateModalPosition);
        window.removeEventListener('scroll', updateModalPosition);
    });
});
</script>

<template>
    <nav>
        <RouterLink
            to="/"
            class="headLogo"
            :class="{
                headLogoActive: isHomePage,
                noUnderline: isHomePage,
            }"
        />

        <ul @wheel="headerScroll">
            <li v-for="button in navButtons" :key="button.path">
                <RouterLink
                    :to="button.path"
                    :class="{ noUnderline: $route.path.includes(button.path.replace('/', '')) }"
                    @click="(e) => button.hasModal && handleHobbyClick(e, button)"
                    @dblclick="() => button.hasModal && handleHobbyDblClick(button)"
                >
                    {{ button.name }}
                </RouterLink>
            </li>

            <div class="headerClock">
                <p>{{ timeTable.time }}</p>
                <p>{{ timeTable.sumDate }}</p>
            </div>
        </ul>

        <!-- Модальное меню для хобби -->
        <ul
            v-if="isModalOpen"
            :style="{
                top: `${modalPosition.top}px`,
                left: `${modalPosition.left}px`,
            }"
            class="modalHeaderMenu"
        >
            <li v-for="anchor in hobbyAnchors" :key="anchor.anchor">
                <a href="#" @click.prevent="navigateToAnchor(anchor.anchor)">
                    {{ anchor.name }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<style scoped></style>
