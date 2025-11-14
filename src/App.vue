<script setup>
import BackGround from './components/BackGround.vue';
import HeaderVue from './components/Header.vue';
</script>

<template>
    <header>
        <h1 id="start">Главная страница - изменения</h1>
        <div class="headerField">
            <HeaderVue />
        </div>
    </header>

    <BackGround />

    <RouterView />

    <footer class="footer">
        <div class="spacer"></div>
        <div class="footer-content">
            <address>Обратная связь: <a href="https://vk.com/anycubickobra">VK</a></address>
            <p>
                При написании использовал блокнот и VS Code с расширением Live Preview + Vue JS +
                Tailwind
            </p>
            <p>&copy; 2025 Лабораторная работа vue. Никакие права не защищены :)</p>
        </div>
        <div class="spacer"><a href="#start" class="upButton">↑</a></div>
    </footer>
</template>

<style scoped></style>
