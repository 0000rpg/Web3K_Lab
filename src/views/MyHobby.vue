<script setup></script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <h2>Мои увлечения</h2>
            <article id="hobby">
                <h3>Мои увлечения</h3>
                <div class="horizontal-container">
                    <div>
                        <p>
                            В свободное время я увлекаюсь программированием, чтением технической
                            литературы и изучением новых технологий.
                        </p>
                        <p>Также люблю активный отдых - велосипедные прогулки и походы в горы.</p>
                        <p>
                            Особое место занимает 3д печать - лучшее занятие для изучения многих
                            интересных областей знаний.
                        </p>
                    </div>
                    <img src="../assets/images/hobby/printer.jpg" class="img-50" />
                </div>
            </article>

            <article id="books">
                <h3>Любимые книги</h3>
                <figure>
                    <img src="../assets/images/hobby/Азимов.jpg" class="img-50" />
                    <figcaption>
                        Цикл произведений "Галактическая история" – Айзек Азимов
                    </figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Гаррисон.jpg" class="img-50" />
                    <figcaption>"Война роботов" – Гарри Гаррисон</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Полковник.jpg" class="img-50" />
                    <figcaption>"Полковник Никто" – Алексей Суконин</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Деривация.jpg" class="img-50" />
                    <figcaption>"Деривация" – Алексей Суконин</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Пикник.jpg" class="img-50" />
                    <figcaption>"Пикник на обочине" – братья Стругацкие</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/1984.webp" class="img-50" />
                    <figcaption>"1984" – Джордж Оруэлл</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Пелевин.jpg" class="img-50" />
                    <figcaption>"Ананасная вода для прекрасной дамы" – Виктор Пелевин</figcaption>
                </figure>
            </article>

            <article id="music">
                <h3>Любимая музыка</h3>
                <p>Предпочитаю классическую музыку, тяжёлый и панк-рок:</p>
                <figure>
                    <img src="../assets/images/hobby/rammstein.webp" class="img-50" />
                    <figcaption>Rammstein</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/КИШ.webp" class="img-50" />
                    <figcaption>КИШ</figcaption>
                </figure>
                <figure>
                    <img src="../assets/images/hobby/Пламенев.jpg" class="img-50" />
                    <figcaption>Группа Павла Пламенева</figcaption>
                </figure>
            </article>

            <article id="movies">
                <h3>Любимые фильмы</h3>
                <ul>
                    <li>Научная фантастика: "Матрица", "Интерстеллар"</li>
                    <li>Фэнтези: "Властелин колец"</li>
                    <li>Драма: "Побег из Шоушенка"</li>
                    <li>Боевик: "Солнцепёк", "Лучшие в аду", "Турист"</li>
                </ul>
            </article>
        </section>
        <aside class="aside-box">
            <section>
                <h3>Категории</h3>
                <ul>
                    <li><a href="#hobby">Моё хобби</a></li>
                    <li><a href="#books">Любимые книги</a></li>
                    <li><a href="#music">Любимая музыка</a></li>
                    <li><a href="#movies">Любимые фильмы</a></li>
                </ul>
            </section>
        </aside>
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
.img-50 {
    max-width: 50%;
    border-radius: 2em;
    max-height: 15em;
    border: 1px solid var(--border);
}

.horizontal-container > div {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-right: 2em;
    padding: 1em;
}

#books {
    h3 {
        width: 100%;
    }
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-direction: row;
}

#books figure {
    .img-50 {
        width: 80%;
        height: auto;
        max-width: 80%;
        object-fit: contain;
        margin-bottom: 1em;
        min-height: 20em;
        border: 0px;
    }
    padding: 1em;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 2em;
    align-items: center;
    display: flex;
    flex-direction: column;
    max-width: 20em;
    min-width: 20%;
    margin: 0.5em;
    transition: 0.2s all linear;
    flex-grow: 100;
}

#books figure:hover {
    scale: 1.02;
}

#music {
    h3,
    p {
        width: 100%;
    }
    img {
        margin: 0.5em;
    }
    ul {
        li {
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        list-style: none;
    }
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: center;
    transition: 0.2s all linear;
}

#movies ul li {
    list-style: none;
}

#music figure {
    transition: 0.2s all linear;
}

#music figure:hover {
    scale: 1.1;
}
</style>
