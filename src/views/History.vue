<script setup></script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Статистика просмотров страниц</h2>

            <h3>История текущего сеанса</h3>
            <div class="table-container">
                <div class="category-table">
                    <div class="table-header tiny">
                        <div class="table-cell">Страница</div>
                        <div class="table-cell">Количество посещений</div>
                    </div>
                    <div id="session-history">
                        <!-- Данные будут заполнены JavaScript -->
                    </div>
                </div>
            </div>

            <h3>История за все время</h3>
            <div class="table-container">
                <div class="category-table">
                    <div class="table-header tiny">
                        <div class="table-cell">Страница</div>
                        <div class="table-cell">Количество посещений</div>
                    </div>
                    <div id="all-time-history">
                        <!-- Данные будут заполнены JavaScript -->
                    </div>
                </div>
            </div>

            <div class="history-controls">
                <button id="clear-session">Очистить историю сеанса</button>
                <button id="clear-all-time">Очистить всю историю</button>
            </div>
        </section>
    </main>
</template>

<style scoped></style>
