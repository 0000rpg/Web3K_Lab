<script setup></script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme" id="trigger">
            <h2>Тест по высшей математике</h2>
            <form action="" method="post" enctype="text/plain">
                <div style="display: flex; flex-direction: column; gap: 1.5em">
                    <div class="form-group">
                        <label for="test-name">ФИО: <span class="required">*</span></label>
                        <input type="text" id="test-name" name="test-name" required />
                    </div>

                    <div class="form-group">
                        <label for="group">Группа: <span class="required">*</span></label>
                        <select id="group" name="group" required>
                            <option value="">-- Выберите группу --</option>
                            <optgroup label="1 курс">
                                <option value="11">ИТ-22</option>
                                <option value="12">ИТ-23</option>
                                <option value="13">ИТ-24</option>
                                <option value="14">ИТ-25</option>
                            </optgroup>
                            <optgroup label="2 курс">
                                <option value="21">ИС-21</option>
                                <option value="22">ИС-22</option>
                                <option value="23">ИС-23</option>
                                <option value="24">ИС-24</option>
                            </optgroup>
                            <optgroup label="3 курс">
                                <option value="31">ПИ-31</option>
                                <option value="32">ПИ-32</option>
                                <option value="33">ПИ-33</option>
                                <option value="34">ПИ-34</option>
                            </optgroup>
                            <optgroup label="4 курс">
                                <option value="41">ПИН-22</option>
                                <option value="42">ПИН-23</option>
                                <option value="43">ПИН-24</option>
                                <option value="44">ПИН-25</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group question-group">
                        <h3>Вопрос 1: Производная функции</h3>
                        <label for="derivative"
                            >Найдите производную функции f(x) = x²:
                            <span class="required">*</span></label
                        >
                        <input type="text" id="derivative" name="derivative" required />
                    </div>
                    <div class="form-group question-group">
                        <h3>Вопрос 2: Интегралы</h3>
                        <p>
                            Выберите правильные утверждения об интегралах:
                            <span class="required">*</span>
                        </p>

                        <div class="checkbox-option">
                            <input type="checkbox" id="int1" name="integrals" value="1" />
                            <label for="int1"
                                >Интеграл от производной функции равен самой функции</label
                            >
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="int2" name="integrals" value="2" />
                            <label for="int2">Определенный интеграл вычисляется на отрезке</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="int3" name="integrals" value="3" />
                            <label for="int3"
                                >Неопределенный интеграл имеет постоянную интегрирования</label
                            >
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="int4" name="integrals" value="4" />
                            <label for="int4"
                                >Интеграл от суммы функций равен сумме интегралов этих
                                функций</label
                            >
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="int5" name="integrals" value="5" />
                            <label for="int5"
                                >Интеграл от постоянной величины всегда равен нулю</label
                            >
                        </div>
                    </div>
                    <div class="form-group question-group">
                        <h3>Вопрос 3: Матрицы</h3>
                        <label for="matrix"
                            >Выберите тип матрицы: <span class="required">[1 2 3 4 5]</span></label
                        >
                        <select id="matrix" name="matrix" required>
                            <option value="">-- Выберите тип матрицы --</option>
                            <optgroup label="Квадратные матрицы">
                                <option value="diag">Диагональная</option>
                                <option value="unit">Единичная</option>
                                <option value="triang">Треугольная</option>
                                <option value="symm">Симметрическая</option>
                            </optgroup>
                            <optgroup label="Прямоугольные матрицы">
                                <option value="row">Матрица-строка</option>
                                <option value="col">Матрица-столбец</option>
                                <option value="zero">Нулевая матрица</option>
                            </optgroup>
                            <optgroup label="Специальные матрицы">
                                <option value="orthog">Ортогональная</option>
                                <option value="inv">Обратная</option>
                                <option value="trans">Транспонированная</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group question-group">
                        <h3>Вопрос 4: Верно ли утверждение?</h3>
                        <label for="question"
                            >Утверждение: <span class="required" id="page-question"></span
                        ></label>
                        <input type="text" id="question" name="question" required />
                        <input type="hidden" id="question-text" name="question_text" value="" />
                    </div>
                    <div class="buttons">
                        <input type="submit" value="Отправить" />
                        <input type="reset" value="Очистить форму" />
                    </div>
                </div>
            </form>
        </section>
    </main>
</template>

<style scoped>
form {
    margin: 0 auto;
    padding: 2em;
    background-color: var(--section);
}

form > div {
    display: flex;
    flex-direction: column;
    gap: 2em;
}

form > div > div {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    padding: 1em;
    background-color: rgba(34, 36, 39, 0.6);
    border: 1px solid var(--border);
    border-radius: 0.75em;
}

h3 {
    color: var(--accent);
    margin: 0 0 0.5em 0;
    padding-bottom: 0.5em;
    border-bottom: 1px solid var(--border-accent);
    font-size: 1.1em;
}

label {
    color: var(--text);
    font-weight: bold;
    margin-bottom: 0.25em;
}

p {
    color: var(--text);
    margin: 0 0 0.5em 0;
    line-height: 1.4;
}

input[type='text'],
select {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.5em;
    padding: 0.75em;
    color: var(--text);
    font-size: 1em;
    transition: all 0.3s ease;
}

input[type='text']:focus,
select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(224, 93, 45, 0.3);
}

select {
    cursor: pointer;
    background-image:
        linear-gradient(45deg, transparent 50%, var(--accent) 50%),
        linear-gradient(135deg, var(--accent) 50%, transparent 50%);
    background-position:
        calc(100% - 20px) center,
        calc(100% - 15px) center;
    background-size:
        5px 5px,
        5px 5px;
    background-repeat: no-repeat;
    appearance: none;
}

optgroup {
    color: var(--theme);
    font-weight: bold;
}

option {
    background-color: var(--background);
    color: var(--text);
    padding: 0.5em;
}

input[type='checkbox'] {
    margin-right: 0.75em;
    accent-color: var(--accent);
    transform: scale(1.1);
    cursor: pointer;
}

div > div > div {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em;
    background-color: rgba(43, 45, 48, 0.3);
    border-radius: 0.5em;
    transition: background-color 0.3s ease;
}

div > div > div:hover {
    background-color: rgba(43, 45, 48, 0.5);
}

input[type='submit'],
input[type='reset'] {
    background-color: var(--accent);
    color: var(--snow);
    border: none;
    border-radius: 0.75em;
    padding: 1em 2em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    font-size: 1em;
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

::placeholder {
    color: var(--marker);
    opacity: 0.7;
}

@media (max-width: 768px) {
    form {
        border-radius: 0;
        border-width: 1px 0;
        margin: 0;
        padding: 1em;
    }

    form > div > div {
        padding: 0.75em;
    }

    div > div > div {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
    }
}
</style>
