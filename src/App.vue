<script setup>
import BackGround from '@/components/BackGround.vue';
import HeaderVue from '@/components/HeaderBlock.vue';
</script>

<template>
    <header>
        <h1 id="start" class="text-center mt-12">Главная страница - изменения</h1>
        <div
            class="headerField fixed top-0 left-0 bg-[#18191a] z-100500 w-full pb-1 m-0 border-b border-[#5c5c5c]"
        >
            <HeaderVue />
        </div>
    </header>

    <BackGround />

    <RouterView />

    <footer
        class="footer w-full pt-4 pb-12 mt-4 bg-[#18191a] border-t border-[#5c5c5c] text-center flex flex-row items-center gap-4 justify-center text-white"
    >
        <div class="spacer h-8 w-32 flex justify-center items-center"></div>
        <div class="footer-content text-white">
            <address class="mt-8 mb-2 text-white">
                Обратная связь:
                <a
                    href="https://vk.com/anycubickobra"
                    class="text-white no-underline relative hover:text-[#ed6c21] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#ed6c21] after:transition-all after:duration-300 hover:after:w-full"
                    >VK</a
                >
            </address>
            <p class="text-sm my-2 text-white">
                При написании использовал блокнот и VS Code с расширением Live Preview + Vue JS +
                Tailwind
            </p>
            <p class="text-sm my-2 text-white">
                &copy; 2025 Лабораторная работа vue. Никакие права не защищены :)
            </p>
        </div>
        <div class="spacer h-8 w-32 flex justify-center items-center">
            <a
                href="#start"
                class="upButton inline-block bg-[#e05d2d] text-white rounded-full border-2 border-[#5c5c5c] no-underline text-3xl font-bold transition-colors duration-300 w-12 h-12 flex justify-center items-center hover:bg-[#ed6c21] hover:border-[#ed6c21]"
            >
                ↑
            </a>
        </div>
    </footer>
</template>

<style scoped></style>
