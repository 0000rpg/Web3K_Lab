<script setup></script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Информация об учебе</h2>
            <p>
                Полное название университета: ФГАОУ ВО «СЕВАСТОПОЛЬСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ»
            </p>
            <p>Полное название кафедры: Информационные системы</p>

            <h3>Перечень изучаемых дисциплин</h3>
        </section>
        <section class="table-container">
            <div class="category-table">
                <div class="th-width">
                    <div class="table-header">
                        <div class="table-cell width-number">№</div>
                        <div class="table-cell width-subject">Дисциплина</div>
                        <div class="th-height">
                            <div class="table-h">Часов в неделю (Лекций, Лаб.раб, Практ. раб)</div>
                            <div class="table-header">
                                <div class="table-cell">1 курс</div>
                                <div class="table-cell">2 курс</div>
                            </div>
                            <div class="table-header">
                                <div class="table-cell">1 сем</div>
                                <div class="table-cell">2 сем</div>
                                <div class="table-cell">3 сем</div>
                                <div class="table-cell">4 сем</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--DATA-->
                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">1</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">Экология</div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">2</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Высшая математика
                    </div>
                    <div class="data-cell" data-label="1 сем">3</div>
                    <div class="data-cell" data-label="1 сем">0</div>
                    <div class="data-cell" data-label="1 сем">3</div>
                    <div class="data-cell" data-label="2 сем">3</div>
                    <div class="data-cell" data-label="2 сем">0</div>
                    <div class="data-cell" data-label="2 сем">3</div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">3</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Русский язык и культура речи
                    </div>
                    <div class="data-cell" data-label="1 сем">1</div>
                    <div class="data-cell" data-label="1 сем">0</div>
                    <div class="data-cell" data-label="1 сем">2</div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">4</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Основы дискретной математики
                    </div>
                    <div class="data-cell" data-label="1 сем">2</div>
                    <div class="data-cell" data-label="1 сем">0</div>
                    <div class="data-cell" data-label="1 сем">1</div>
                    <div class="data-cell" data-label="2 сем">3</div>
                    <div class="data-cell" data-label="2 сем">0</div>
                    <div class="data-cell" data-label="2 сем">2</div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="3 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">5</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Основы программирования и алгоритмические языки
                    </div>
                    <div class="data-cell" data-label="1 сем">3</div>
                    <div class="data-cell" data-label="1 сем">2</div>
                    <div class="data-cell" data-label="1 сем">0</div>
                    <div class="data-cell" data-label="2 сем">3</div>
                    <div class="data-cell" data-label="2 сем">3</div>
                    <div class="data-cell" data-label="2 сем">0</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">6</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Основы экологии
                    </div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">7</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Теория вероятностей и математическая статистика
                    </div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">3</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">8</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">Физика</div>
                    <div class="data-cell" data-label="1 сем">2</div>
                    <div class="data-cell" data-label="1 сем">2</div>
                    <div class="data-cell" data-label="1 сем">0</div>
                    <div class="data-cell" data-label="2 сем">2</div>
                    <div class="data-cell" data-label="2 сем">2</div>
                    <div class="data-cell" data-label="2 сем">0</div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">9</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Основы электропитания и электроники
                    </div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                    <div class="data-cell" data-label="4 сем"></div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">10</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Численные методы в информатике
                    </div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="3 сем">2</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="4 сем">0</div>
                    <div class="data-cell" data-label="4 сем">0</div>
                    <div class="data-cell" data-label="4 сем">1</div>
                </div>

                <div class="table-row">
                    <div class="table-cell width-number" data-label="№">11</div>
                    <div class="table-cell width-subject" data-label="Дисциплина">
                        Методы исследования операций
                    </div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="1 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="2 сем"></div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">1</div>
                    <div class="data-cell" data-label="3 сем">0</div>
                    <div class="data-cell" data-label="4 сем">2</div>
                    <div class="data-cell" data-label="4 сем">1</div>
                    <div class="data-cell" data-label="4 сем">1</div>
                </div>
            </div>
        </section>
        <section class="table-wrap">
            <table class="plan" aria-label="План учебного процесса">
                <thead>
                    <tr class="title-row">
                        <th colspan="9">ПЛАН УЧЕБНОГО ПРОЦЕССА</th>
                    </tr>
                    <tr>
                        <th class="col-number" rowspan="2">№</th>
                        <th class="col-discipline" rowspan="2">Дисциплина</th>
                        <th class="col-dept" rowspan="2">Кафедра</th>
                        <th colspan="6">Всего часов</th>
                    </tr>
                    <tr>
                        <th>Всего</th>
                        <th>Ауд</th>
                        <th>Лк</th>
                        <th>Лб</th>
                        <th>Пр</th>
                        <th>СРС</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td class="col-discipline">Экология</td>
                        <td>БЖ</td>
                        <td>54</td>
                        <td>27</td>
                        <td>18</td>
                        <td>0</td>
                        <td>9</td>
                        <td>27</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td class="col-discipline">Высшая математика</td>
                        <td>ВМ</td>
                        <td>540</td>
                        <td>282</td>
                        <td>141</td>
                        <td>0</td>
                        <td>141</td>
                        <td>258</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td class="col-discipline">Русский язык и культура речи</td>
                        <td>НГиГ</td>
                        <td>108</td>
                        <td>54</td>
                        <td>18</td>
                        <td>0</td>
                        <td>36</td>
                        <td>54</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td class="col-discipline">Основы дискретной математики</td>
                        <td>ИС</td>
                        <td>216</td>
                        <td>139</td>
                        <td>87</td>
                        <td>0</td>
                        <td>52</td>
                        <td>77</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td class="col-discipline">
                            Основы программирования и алгоритмические языки
                        </td>
                        <td>ИС</td>
                        <td>405</td>
                        <td>210</td>
                        <td>105</td>
                        <td>87</td>
                        <td>18</td>
                        <td>195</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td class="col-discipline">Основы экологии</td>
                        <td>ПЭОП</td>
                        <td>54</td>
                        <td>27</td>
                        <td>18</td>
                        <td>0</td>
                        <td>9</td>
                        <td>27</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td class="col-discipline">
                            Теория вероятностей и математическая статистика
                        </td>
                        <td>ИС</td>
                        <td>162</td>
                        <td>72</td>
                        <td>54</td>
                        <td>18</td>
                        <td>0</td>
                        <td>90</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td class="col-discipline">Физика</td>
                        <td>Физики</td>
                        <td>324</td>
                        <td>194</td>
                        <td>106</td>
                        <td>88</td>
                        <td>0</td>
                        <td>130</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td class="col-discipline">Основы электротехники и электроники</td>
                        <td>ИС</td>
                        <td>108</td>
                        <td>72</td>
                        <td>36</td>
                        <td>18</td>
                        <td>18</td>
                        <td>36</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td class="col-discipline">Численные методы в информатике</td>
                        <td>ИС</td>
                        <td>189</td>
                        <td>89</td>
                        <td>36</td>
                        <td>36</td>
                        <td>17</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td class="col-discipline">Методы исследования операций</td>
                        <td>ИС</td>
                        <td>216</td>
                        <td>104</td>
                        <td>52</td>
                        <td>35</td>
                        <td>17</td>
                        <td>112</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>

<style scoped></style>
