<script setup>
import { useContactsStore } from '@/stores/contacts';
import { storeToRefs } from 'pinia';
import Calendar from '@/components/CalendarBlock.vue';

const contactsStore = useContactsStore();
const { contactsConstructor, contactsData, contactsErrors, isFormValid } =
    storeToRefs(contactsStore);
const { handleSubmit, resetForm, updateAgeFromBirthdate, validateField } = contactsStore;

const handleDateSelected = (date) => {
    updateAgeFromBirthdate(date);
};

// Обработчик сброса формы
const handleReset = () => {
    resetForm();
};

// Валидация при изменении поля
const handleInput = (fieldName, value) => {
    validateField(fieldName, value);
};
</script>

<template>
    <form @submit.prevent="handleSubmit" @reset="handleReset" class="p-0 bg-[#222427]">
        <div class="flex flex-col flex-grow gap-6 m-4">
            <div
                v-for="form in contactsConstructor"
                :key="form.id"
                class="flex flex-col gap-2 pr-8"
            >
                <!-- Поле ФИО -->
                <div
                    v-if="form.input && form.input.type === 'text' && form.input.name === 'name'"
                    class="flex flex-col sm:flex-row sm:items-start sm:gap-4 w-full max-w-full"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1">
                        <input
                            :type="form.input.type"
                            :id="form.input.id"
                            :name="form.input.name"
                            v-model="contactsData.name"
                            @input="handleInput('name', contactsData.name)"
                            @blur="validateField('name', contactsData.name)"
                            required
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                            :class="{
                                'border-2 border-green-500':
                                    contactsData.name && !contactsErrors.name,
                                'border-2 border-red-500': contactsErrors.name,
                            }"
                        />
                        <div v-if="contactsErrors.name" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.name }}
                        </div>
                    </div>
                </div>

                <!-- Радио-кнопки -->
                <div
                    v-if="form.variables"
                    class="flex flex-col sm:flex-row sm:items-start sm:gap-4"
                >
                    <label
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1 gap-2">
                        <div class="flex items-center gap-4 flex-wrap">
                            <template v-for="variable in form.variables" :key="variable.id">
                                <div class="flex items-center gap-2">
                                    <input
                                        :type="variable.input.type"
                                        :id="variable.input.id"
                                        :name="variable.input.name"
                                        :value="variable.input.value"
                                        v-model="contactsData.gender"
                                        class="appearance-none rounded-full w-5 h-5 border-2 border-[#e05d2d] transition-all outline-none checked:border-4 checked:border-[#ed6c21]"
                                    />
                                    <label
                                        :for="variable.for"
                                        class="text-[#f5f5f5] cursor-pointer"
                                        >{{ variable.label }}</label
                                    >
                                </div>
                            </template>
                        </div>
                        <div v-if="contactsErrors.gender" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.gender }}
                        </div>
                    </div>
                </div>

                <!-- Select -->
                <div
                    v-if="form.components"
                    class="flex flex-col sm:flex-row sm:items-center sm:gap-4"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <select
                        :name="form.selectName"
                        :id="form.selectId"
                        v-model="contactsData.age"
                        class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base cursor-pointer focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                    >
                        <option disabled value="">Выберите значение</option>
                        <option v-for="opt in form.components" :key="opt.id" :value="opt.value">
                            {{ opt.text }}
                        </option>
                    </select>
                </div>

                <!-- Телефон -->
                <div
                    v-if="form.input && form.input.name === 'phone'"
                    class="flex flex-col sm:flex-row sm:items-center sm:gap-4"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1">
                        <input
                            :type="form.input.type"
                            :id="form.input.id"
                            :name="form.input.name"
                            v-model="contactsData.phone"
                            @input="handleInput('phone', contactsData.phone)"
                            @blur="validateField('phone', contactsData.phone)"
                            required
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                            :class="{
                                'border-2 border-green-500':
                                    contactsData.phone && !contactsErrors.phone,
                                'border-2 border-red-500': contactsErrors.phone,
                            }"
                        />
                        <div v-if="contactsErrors.phone" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.phone }}
                        </div>
                    </div>
                </div>

                <!-- Email -->
                <div
                    v-if="form.input && form.input.type === 'email'"
                    class="flex flex-col sm:flex-row sm:items-center sm:gap-4"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1">
                        <input
                            :type="form.input.type"
                            :id="form.input.id"
                            :name="form.input.name"
                            v-model="contactsData.email"
                            @input="handleInput('email', contactsData.email)"
                            @blur="validateField('email', contactsData.email)"
                            required
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                            :class="{
                                'border-2 border-green-500':
                                    contactsData.email && !contactsErrors.email,
                                'border-2 border-red-500': contactsErrors.email,
                            }"
                        />
                        <div v-if="contactsErrors.email" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.email }}
                        </div>
                    </div>
                </div>

                <!-- Календарь -->
                <div
                    v-if="form.customComponent === 'Calendar'"
                    class="flex flex-col sm:flex-row sm:items-start sm:gap-4"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1">
                        <Calendar
                            :id="form.for"
                            :name="form.for"
                            v-model="contactsData.birthdate"
                            @date-selected="handleDateSelected"
                        />
                        <div v-if="contactsErrors.birthdate" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.birthdate }}
                        </div>
                    </div>
                </div>

                <!-- Textarea -->
                <div v-if="form.textarea" class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1">
                        <textarea
                            :id="form.textarea.id"
                            :name="form.textarea.name"
                            :rows="form.textarea.rows"
                            v-model="contactsData.message"
                            @input="handleInput('message', contactsData.message)"
                            @blur="validateField('message', contactsData.message)"
                            required
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 resize-y min-h-[100px] w-full"
                            :class="{
                                'border-2 border-green-500':
                                    contactsData.message && !contactsErrors.message,
                                'border-2 border-red-500': contactsErrors.message,
                            }"
                        ></textarea>
                        <div v-if="contactsErrors.message" class="text-red-500 text-sm mt-1">
                            {{ contactsErrors.message }}
                        </div>
                    </div>
                </div>

                <!-- Кнопки -->
                <template v-if="form.controller">
                    <div class="flex flex-col sm:flex-row gap-3 mt-4">
                        <input
                            v-for="controller in form.buttons"
                            :key="controller.id"
                            :type="controller.type"
                            :value="controller.value"
                            class="bg-[#e05d2d] text-white border-none rounded-xl py-3 px-6 font-bold cursor-pointer transition-all hover:bg-[#ed6c21] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(237,108,33,0.3)] flex-1"
                            :class="{
                                'bg-[#757575] hover:bg-[#b3b3b3]': controller.type === 'reset',
                                'opacity-60 cursor-not-allowed':
                                    !isFormValid && controller.type === 'submit',
                            }"
                            :disabled="!isFormValid && controller.type === 'submit'"
                        />
                    </div>
                </template>
            </div>
        </div>
    </form>
</template>
