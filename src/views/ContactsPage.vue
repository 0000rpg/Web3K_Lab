<script setup>
import FormGenerator from '@/components/FormGenerator.vue';
</script>

<template>
    <main>
        <section class="mainTheme">
            <h2>Свяжитесь со мной</h2>
            <FormGenerator />
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
}

form {
    padding: 1.5em;
    background-color: var(--section);
    border: 1px solid var(--border);
    padding: 0;
}

form > div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1.5em;
    margin: 1em;
}

form > div > div {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

label {
    color: var(--text);
    font-weight: bold;
    margin-bottom: 0.25em;
    border-bottom: 1px solid var(--border);
    padding: 0.5em;
    min-width: 25%;
}

input[type='text'],
input[type='email'],
select,
textarea {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 1em;
    padding: 0.75em;
    margin: 0.5em;
    color: var(--text);
    font-size: 1em;
    transition: border-color 0.3s ease;
    flex-grow: 100;
    flex-grow: 1;
    width: 90%;
}

input[type='text']:focus,
input[type='email']:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(224, 93, 45, 0.2);
}

input[type='radio'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    border-radius: 50%;
    width: 1.2em;
    height: 1.2em;
    aspect-ratio: 1;

    border: 2px solid var(--accent);
    transition: 0.2s all linear;
    outline: none;
    margin-right: 5px;
    margin-bottom: 2px;
}

input[type='radio']:checked {
    border: 4px solid var(--theme);
}

div > div {
    display: flex;
    align-items: center;
    gap: 1em;
    flex-wrap: wrap;

    flex-grow: 1;
}

input[type='submit'],
input[type='reset'] {
    background-color: var(--accent);
    color: var(--snow);
    border: none;
    border-radius: 1em;
    padding: 0.75em 1.5em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    width: 100%;
}

input[type='submit']:hover,
input[type='reset']:hover {
    background-color: var(--theme);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(237, 108, 33, 0.3);
}

input[type='reset'] {
    background-color: var(--border-accent);
}

input[type='reset']:hover {
    background-color: var(--marker);
}

select {
    cursor: pointer;
    margin: 0;
    width: 93%;
}

textarea {
    resize: vertical;
    min-height: 100px;
}

::placeholder {
    color: var(--marker);
    opacity: 0.7;
}

@media (max-width: 500px) {
    form {
        border-radius: 0;
        border-width: 1px 0;
        margin: 0;
        padding: 1em;
    }

    div > div {
        margin: 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
    }
}

/* Лабораторная работа 3 */
.birthdate-wrapper {
    position: relative;
}

.birthdate-input {
    padding: 6px;
    margin-top: 4px;
    width: 160px;
    cursor: pointer;
}

.calendar-popup {
    position: absolute;
    background: var(--header);
    border: 1px solid var(--border);
    border-radius: 1em;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 999;
    width: 220px;
    display: none;
}

.calendar-popup.open {
    display: block;
}

.calendar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.calendar-prev,
.calendar-next {
    cursor: pointer;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 1em;
    color: var(--snow);
    height: 2em;
}

.calendar-prev:hover,
.calendar-next:hover {
    color: var(--theme);
    border-color: var(--theme);
}

.calendar-year {
    flex: 1;
    margin: 0 8px;
}

.calendar-month-label {
    text-align: center;
    font-weight: bold;
    margin-bottom: 6px;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 4px;
}

.calendar-weekday {
    text-align: center;
    font-weight: bold;
    font-size: 0.8em;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.calendar-day {
    padding: 6px;
    text-align: center;
    cursor: pointer;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--section);
    color: var(--snow);
}

.calendar-day.empty {
    border: none;
    background: transparent;
    cursor: default;
}

.calendar-day:hover {
    background: var(--border);
}

.calendar-day.is-today {
    border: 1px solid var(--theme);
    background: var(--section);
}

/* Дополнительная стилизация валидации */
.valid {
    border: 2px solid #4caf50 !important;
    background-color: var(--section);
}

.invalid {
    border: 2px solid #f44336 !important;
    background-color: var(--background);
}

.error-message {
    color: #d93025;
    font-size: 0.8em;
    margin-top: 4px;
}

input[type='submit']:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
}

input[type='submit'].form-valid {
    background-color: #4caf50;
    color: var(--text);
}
</style>
