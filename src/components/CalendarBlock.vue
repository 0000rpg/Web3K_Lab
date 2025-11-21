<template>
    <div class="relative birthdate-wrapper">
        <input
            type="text"
            :id="id"
            :name="name"
            v-model="displayValue"
            readonly
            @click="toggleCalendar"
            class="birthdate-input p-1.5 mt-1 w-full cursor-pointer bg-[#1c1e21] border border-[#5c5c5c] rounded-xl text-[#f5f5f5] focus:outline-none focus:border-[#e05d2d]"
        />
        <div
            v-if="showCalendar"
            class="calendar-popup absolute bg-[#18191a] border border-[#5c5c5c] rounded-xl p-2.5 shadow-lg z-50 w-56 bottom-full mb-2"
        >
            <div class="calendar-top flex justify-between items-center mb-2">
                <button
                    type="button"
                    @click="prevMonth"
                    class="calendar-prev cursor-pointer bg-[#1c1e21] border border-[#5c5c5c] rounded-xl text-white w-8 h-8 flex items-center justify-center hover:text-[#ed6c21] hover:border-[#ed6c21] transition-colors"
                >
                    ←
                </button>
                <select
                    v-model="currentYear"
                    @change="renderCalendar"
                    class="calendar-year bg-[#1c1e21] border border-[#5c5c5c] rounded-xl text-white p-1 mx-2 flex-1"
                >
                    <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
                <button
                    type="button"
                    @click="nextMonth"
                    class="calendar-next cursor-pointer bg-[#1c1e21] border border-[#5c5c5c] rounded-xl text-white w-8 h-8 flex items-center justify-center hover:text-[#ed6c21] hover:border-[#ed6c21] transition-colors"
                >
                    →
                </button>
            </div>
            <div class="calendar-month-label text-center font-bold mb-1.5 text-white">
                {{ months[currentMonth] }}
            </div>
            <div class="calendar-weekdays grid grid-cols-7 gap-1 mb-1">
                <div
                    v-for="day in weekdays"
                    :key="day"
                    class="calendar-weekday text-center font-bold text-sm text-white"
                >
                    {{ day }}
                </div>
            </div>
            <div class="calendar-grid grid grid-cols-7 gap-1">
                <div
                    v-for="empty in offset"
                    :key="'empty-' + empty"
                    class="calendar-day empty"
                ></div>
                <button
                    v-for="day in daysInMonth"
                    :key="day"
                    type="button"
                    @click="selectDate(day)"
                    class="calendar-day p-1.5 text-center cursor-pointer border border-[#5c5c5c] rounded bg-[#222427] text-white text-sm hover:bg-[#5c5c5c] transition-colors"
                    :class="{ 'border-[#ed6c21] bg-[#222427]': isToday(day) }"
                >
                    {{ day }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
    id: String,
    name: String,
    modelValue: String,
});

const emit = defineEmits(['update:modelValue', 'dateSelected']);

const showCalendar = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const displayValue = ref('');

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const years = computed(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 101 }, (_, i) => current - 100 + i);
});

const offset = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
});

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const isToday = (day) => {
    const today = new Date();
    return (
        day === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()
    );
};

const toggleCalendar = () => {
    showCalendar.value = !showCalendar.value;
};

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

const selectDate = (day) => {
    const formattedDate = `${String(day).padStart(2, '0')}.${String(currentMonth.value + 1).padStart(2, '0')}.${currentYear.value}`;

    displayValue.value = formattedDate;
    emit('update:modelValue', formattedDate);
    emit('dateSelected', formattedDate);
    showCalendar.value = false;
};

// Закрытие календаря при клике вне компонента
const handleClickOutside = (event) => {
    const calendarEl = document.querySelector('.birthdate-wrapper');
    if (calendarEl && !calendarEl.contains(event.target)) {
        showCalendar.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

// Добавляем computed свойство для валидации формы в FormGenerator
const isFormValid = computed(() => {
    return (
        contactsData.value.name &&
        contactsData.value.phone &&
        contactsData.value.email &&
        contactsData.value.message &&
        !contactsErrors.value.name &&
        !contactsErrors.value.phone &&
        !contactsErrors.value.email &&
        !contactsErrors.value.message
    );
});
</script>
