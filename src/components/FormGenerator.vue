<script setup>
import { storeToRefs } from 'pinia';
import Calendar from '@/components/CalendarBlock.vue';

const props = defineProps({
    store: {
        type: Object,
        required: true,
    },
});

const {
    contactsConstructor: formConstructor,
    contactsData: formData,
    contactsErrors: formErrors,
    isFormValid,
    validationInProgress,
    botFeedback,
} = storeToRefs(props.store);

const { handleSubmit, resetForm, updateAgeFromBirthdate, validateField, validateForm } =
    props.store;

const handleDateSelected = (date) => {
    if (updateAgeFromBirthdate) {
        updateAgeFromBirthdate(date);
    }
};

const handleReset = () => {
    if (resetForm) {
        resetForm();
    }
};

const handleInput = (fieldName, value) => {
    if (validateField) {
        validateField(fieldName, value);
    }
};

const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (validateForm) {
        await validateForm();
    }

    if (handleSubmit) {
        await handleSubmit();
    }
};
</script>

<template>
    <form @submit="handleFormSubmit" @reset="handleReset" class="p-0 bg-[#222427]">
        <div class="flex flex-col flex-grow gap-6 m-4">
            <div
                v-if="validationInProgress"
                class="bg-blue-500 text-white p-3 rounded-xl text-center"
            >
                Проверка ваших ответов...
            </div>

            <div
                v-for="(form, index) in formConstructor"
                :key="index"
                class="flex flex-col gap-2 pr-8"
            >
                <h3 v-if="form.title" class="text-[#f5f5f5] font-bold mb-2">
                    {{ form.title }}
                </h3>

                <p v-if="form.context" class="text-[#f5f5f5] mb-2">
                    {{ form.context }}
                </p>

                <div
                    v-if="form.input && !form.variables"
                    class="flex flex-col sm:flex-row sm:items-start sm:gap-4 w-full max-w-full"
                >
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                        <span v-if="form.required" class="required text-red-500">*</span>
                    </label>
                    <div class="flex flex-col flex-1">
                        <input
                            :type="form.input.type"
                            :id="form.input.id"
                            :name="form.input.name"
                            v-model="formData[form.input.name]"
                            @input="handleInput(form.input.name, formData[form.input.name])"
                            @blur="handleInput(form.input.name, formData[form.input.name])"
                            :required="form.required"
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full min-w-[60%]"
                            :class="{
                                'border-2 border-green-500':
                                    formData[form.input.name] &&
                                    !formErrors[form.input.name] &&
                                    (!form.usesBot || !botFeedback[form.input.name]),
                                'border-2 border-red-500': formErrors[form.input.name],
                                'border-2 border-yellow-500':
                                    form.usesBot && botFeedback && botFeedback[form.input.name],
                            }"
                        />
                        <div
                            v-if="
                                formErrors[form.input.name] &&
                                (!form.usesBot || !botFeedback || !botFeedback[form.input.name])
                            "
                            class="text-red-500 text-sm mt-1"
                        >
                            {{ formErrors[form.input.name] }}
                        </div>
                        <div
                            v-if="form.usesBot && botFeedback && botFeedback[form.input.name]"
                            class="text-yellow-500 text-sm mt-1"
                        >
                            {{ botFeedback[form.input.name].feedback }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="form.variables && form.variables[0]?.input?.type === 'radio'"
                    class="flex flex-col sm:flex-row sm:items-start sm:gap-4"
                >
                    <label
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                    </label>
                    <div class="flex flex-col flex-1 gap-2">
                        <div class="flex items-center gap-4 flex-wrap">
                            <template v-for="variable in form.variables" :key="variable.input.id">
                                <div class="flex items-center gap-2">
                                    <input
                                        :type="variable.input.type"
                                        :id="variable.input.id"
                                        :name="variable.input.name"
                                        :value="variable.input.value"
                                        v-model="formData[variable.input.name]"
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
                        <div
                            v-if="formErrors[form.variables[0].input.name]"
                            class="text-red-500 text-sm mt-1"
                        >
                            {{ formErrors[form.variables[0].input.name] }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="form.variables && form.variables[0]?.input?.type === 'checkbox'"
                    class="flex flex-col sm:flex-collumn sm:items-start sm:gap-4"
                >
                    <div
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                        <span v-if="form.required" class="required text-red-500">*</span>
                    </div>
                    <div class="flex flex-col flex-1 gap-2">
                        <template v-for="variable in form.variables" :key="variable.input.id">
                            <div class="flex items-center gap-2 checkbox-option">
                                <input
                                    :type="variable.input.type"
                                    :id="variable.input.id"
                                    :name="variable.input.name"
                                    :value="variable.input.value"
                                    v-model="formData[variable.input.name]"
                                    class="appearance-none rounded w-5 h-5 border-2 border-[#e05d2d] transition-all outline-none checked:bg-[#e05d2d]"
                                />
                                <label :for="variable.for" class="text-[#f5f5f5] cursor-pointer">{{
                                    variable.label
                                }}</label>
                            </div>
                        </template>
                        <div
                            v-if="
                                formErrors[form.variables[0].input.name] &&
                                (!form.usesBot ||
                                    !botFeedback ||
                                    !botFeedback[form.variables[0].input.name])
                            "
                            class="text-red-500 text-sm mt-1"
                        >
                            {{ formErrors[form.variables[0].input.name] }}
                        </div>
                        <div
                            v-if="
                                form.usesBot &&
                                botFeedback &&
                                botFeedback[form.variables[0].input.name]
                            "
                            class="text-yellow-500 text-sm mt-1"
                        >
                            {{ botFeedback[form.variables[0].input.name].feedback }}
                        </div>
                    </div>
                </div>

                <div v-if="form.groups" class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                        <span v-if="form.required" class="required text-red-500">*</span>
                    </label>
                    <select
                        :name="form.selectName"
                        :id="form.selectId"
                        v-model="formData[form.selectName]"
                        :required="form.required"
                        class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base cursor-pointer focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                    >
                        <option disabled value="">-- Выберите значение --</option>
                        <optgroup
                            v-for="group in form.groups"
                            :key="group.label"
                            :label="group.label"
                        >
                            <option
                                v-for="option in group.options"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.text }}
                            </option>
                        </optgroup>
                    </select>
                </div>

                <div
                    v-if="form.components && !form.groups"
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
                        v-model="formData[form.selectName]"
                        class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base cursor-pointer focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 w-full"
                    >
                        <option disabled value="">Выберите значение</option>
                        <option v-for="opt in form.components" :key="opt.value" :value="opt.value">
                            {{ opt.text }}
                        </option>
                    </select>
                </div>

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
                            v-model="formData[form.for]"
                            @date-selected="handleDateSelected"
                        />
                        <div v-if="formErrors[form.for]" class="text-red-500 text-sm mt-1">
                            {{ formErrors[form.for] }}
                        </div>
                    </div>
                </div>

                <div v-if="form.textarea" class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <label
                        :for="form.for"
                        class="text-[#f5f5f5] font-bold mb-1 border-b border-[#5c5c5c] p-2 min-w-[25%]"
                    >
                        {{ form.label }}
                        <span v-if="form.required" class="required text-red-500">*</span>
                    </label>
                    <div class="flex flex-col flex-1">
                        <textarea
                            :id="form.textarea.id"
                            :name="form.textarea.name"
                            :rows="form.textarea.rows"
                            v-model="formData[form.textarea.name]"
                            @input="handleInput(form.textarea.name, formData[form.textarea.name])"
                            @blur="handleInput(form.textarea.name, formData[form.textarea.name])"
                            :required="form.required"
                            class="bg-[#1c1e21] border border-[#5c5c5c] rounded-xl p-3 text-[#f5f5f5] text-base transition-colors focus:outline-none focus:border-[#e05d2d] focus:ring-2 focus:ring-[#e05d2d] focus:ring-opacity-20 resize-y min-h-[100px] w-full"
                            :class="{
                                'border-2 border-green-500':
                                    formData[form.textarea.name] && !formErrors[form.textarea.name],
                                'border-2 border-red-500': formErrors[form.textarea.name],
                            }"
                        ></textarea>
                        <div
                            v-if="formErrors[form.textarea.name]"
                            class="text-red-500 text-sm mt-1"
                        >
                            {{ formErrors[form.textarea.name] }}
                        </div>
                    </div>
                </div>

                <template v-if="form.controller">
                    <div class="flex flex-col sm:flex-row gap-3 mt-4">
                        <input
                            v-for="(controller, btnIndex) in form.buttons"
                            :key="btnIndex"
                            :type="controller.type"
                            :value="
                                controller.type === 'submit' && validationInProgress
                                    ? 'Проверка...'
                                    : controller.value
                            "
                            class="bg-[#e05d2d] text-white border-none rounded-xl py-3 px-6 font-bold cursor-pointer transition-all hover:bg-[#ed6c21] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(237,108,33,0.3)] flex-1"
                            :class="{
                                'bg-[#757575] hover:bg-[#b3b3b3]': controller.type === 'reset',
                                'opacity-60 cursor-not-allowed':
                                    controller.type === 'submit' &&
                                    (!isFormValid || validationInProgress),
                            }"
                            :disabled="
                                controller.type === 'submit' &&
                                (!isFormValid || validationInProgress)
                            "
                        />
                    </div>
                </template>
            </div>
        </div>
    </form>
</template>

<style scoped>
.required {
    color: #e05d2d;
}
.checkbox-option {
    margin-bottom: 0.5rem;
}
</style>
