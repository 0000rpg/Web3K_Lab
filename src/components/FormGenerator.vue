<script setup>
import { ref } from 'vue';

const contactsConstructor = ref([
    {
        label: 'ФИО:',
        for: 'name',
        input: {
            type: 'text',
            id: 'name',
            name: 'name',
            bind: contactsData.value.name,
            error: contactsErrors.value.name,
            validate: '',
        },
    },
    {
        label: 'Пол:',
        components: [
            {
                label: 'Мужской',
                for: 'male',
                input: {
                    type: 'radio',
                    id: 'male',
                    name: 'gender',
                    value: 'male',
                },
            },
            {
                label: 'Женский',
                for: 'female',
                input: {
                    type: 'radio',
                    id: 'female',
                    name: 'gender',
                    value: 'female',
                },
            },
        ],
    },
    {
        label: 'Возраст:',
        for: 'age',
        selectName: 'age',
        selectId: 'age',
        components: [
            {
                value: 'none',
                text: 'Выберите возраст',
            },
            {
                value: 'less16',
                text: 'До 16',
            },
            {
                value: '16to18',
                text: '16-18',
            },
            {
                value: '18to30',
                text: '18-30',
            },
            {
                value: 'moreThan30',
                text: '30+',
            },
        ],
    },
    {
        label: 'E-mail:',
        for: 'email',
        input: {
            type: 'email',
            id: 'email',
            name: 'email',
        },
    },
    {
        label: 'Сообщение:',
        for: 'message',
        textarea: {
            rows: 'message',
            id: 'message',
            name: 'message',
        },
    },
    {
        controller: true,
        buttons: [
            {
                type: 'submit',
                value: 'Отправить',
            },
            {
                type: 'reset',
                value: 'Очистить форму',
            },
        ],
    },
]);

const contactsData = ref({
    name: '',
    gender: '',
    age: '',
    email: '',
    message: '',
});

const contactsErrors = ref({
    name: '',
    gender: '',
    email: '',
    message: '',
});
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <div>
                <label for="name">ФИО:</label>
                <input type="text" id="name" name="name" required />
            </div>

            <div>
                <label>Пол:</label>
                <div>
                    <input type="radio" id="male" name="gender" value="male" />
                    <label for="male">Мужской</label>

                    <input type="radio" id="female" name="gender" value="female" />
                    <label for="female">Женский</label>
                </div>
            </div>

            <div>
                <label for="age">Возраст:</label>
                <select id="age" name="age">
                    <option value="">Выберите возраст</option>
                    <option value="">До 16</option>
                    <option value="">16-18</option>
                    <option value="">18-30</option>
                    <option value="">30+</option>
                </select>
            </div>

            <div>
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" required />
            </div>

            <div>
                <label for="message">Сообщение:</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>

            <div style="display: flex; gap: 1em">
                <input type="submit" value="Отправить" style="flex: 1" />
                <input type="reset" value="Очистить форму" style="flex: 1" />
            </div>
        </div>
    </form>
</template>

<style scoped></style>
