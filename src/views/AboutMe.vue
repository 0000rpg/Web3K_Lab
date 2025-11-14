<script setup>
import { useAboutMeStore } from '@/stores/aboutMe';
import { storeToRefs } from 'pinia';

const aboutMeStore = useAboutMeStore();
const { articles, autoBiography } = storeToRefs(aboutMeStore);
</script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Автобиография</h2>
            <div
                v-for="container in autoBiography"
                :key="container.id"
                class="horizontal-container"
            >
                <div v-if="container.name">
                    <h3 v-if="container.name">{{ container.name }}</h3>
                    <template v-if="container.context">
                        <p v-for="text in container.context" :key="text.id">{{ text }}</p>
                    </template>
                    <ul v-if="container.table">
                        <li v-for="cell in container.table" :key="cell.id">
                            <img :id="cell.img.id" :src="cell.img.src" />
                            <div>{{ cell.text }}</div>
                        </li>
                    </ul>
                </div>
                <div v-if="container.img">
                    <img :class="container.img.class" />
                </div>
            </div>
        </section>
        <section>
            <h2>Интересные факты</h2>
            <div class="horizontal-container vertical">
                <section v-for="article in articles" :key="article.id">
                    <h3>{{ article.name }}</h3>
                    <p v-if="article.caption">{{ article.caption }}</p>
                    <div v-for="fact in article.facts" :key="fact.id">
                        <h4>{{ fact.name }}</h4>
                        <p>{{ fact.text }}</p>
                    </div>
                </section>
                <div>
                    <h3>IT</h3>
                    <div
                        id="page-autowriter"
                        prompt="Привет, расскажи побольше интересных фактов о программировании или о каком-либо выбранном языке. Учти, что ты должен поразить профессионала в этой отрасли. Пиши без форматирования с хорошими отступами и без пояснений в виде диалога. Не пиши слова мне по типу понял тебя или хорошо..."
                    >
                        ???
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.horizontal-container {
    ul {
        li {
            margin: 1em 0.5em 1em 0.5em;
            padding: 0.5em;
            padding-bottom: 0.2em;
            padding-top: 0.2em;
            border-radius: 0.5em;
            margin-top: 0.2em;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: 0.2s all linear;
        }
        li:hover {
            scale: 1.1;
        }
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        box-sizing: border-box;
        margin-top: 0.5em;
    }
}

.horizontal-container.vertical {
    flex-direction: column;
}

.page-autowriter {
    text-align: justify;
    line-height: 1.6;
    font-size: medium;
    padding: 0.5em 2em 0.5em 2em;
}

#web-logo {
    mask-image: url('../assets/images/web.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: white;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: white;
    min-width: 40px;
}
#programming-logo {
    mask-image: url('../assets/images/programming.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: white;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: white;
    min-width: 40px;
}
#admin-logo {
    mask-image: url('../assets/images/admin.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: white;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: white;
    min-width: 40px;
}
#sql-logo {
    mask-image: url('../assets/images/sql.png');
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: white;
    height: 2em;
    width: 3em;
    margin: 0.5em;
    color: white;
    min-width: 40px;
}
</style>
