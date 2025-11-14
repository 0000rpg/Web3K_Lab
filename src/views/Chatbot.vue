<script setup></script>

<template>
    <main>
        <canvas class="background"></canvas>
        <section class="mainTheme">
            <p>Панель для просмотра</p>
        </section>
        <article>
            <!--Chatbot-->
            <div class="container">
                <h3>Чат-бот</h3>
                <div class="model-info">
                    <h4>Используемая модель:</h4>
                    <p>
                        <strong>deepseek/deepseek-chat-v3.1:free</strong> - бесплатная модель от
                        DeepSeek
                    </p>
                </div>

                <div class="memory-options">
                    <label>
                        <input type="radio" name="memory-type" id="session-memory" />
                        Память сессии (до перезагрузки)
                    </label>
                    <label>
                        <input type="radio" name="memory-type" id="local-memory" checked />
                        Постоянная память (после перезагрузки)
                    </label>
                </div>

                <div class="input-group api-key">
                    <label for="api-key">API ключ:</label>
                    <input type="text" id="api-key" placeholder="Введите ваш API ключ" />
                </div>

                <div class="input-group site-url">
                    <label for="site-url">URL вашего сайта (опционально):</label>
                    <input type="text" id="site-url" placeholder="https://example.com" />
                </div>

                <div class="input-group site-name">
                    <label for="site-name">Название сайта (опционально):</label>
                    <input type="text" id="site-name" placeholder="Мой сайт" />
                </div>

                <div class="input-group">
                    <label for="user-input">Ваше сообщение:</label>
                    <textarea
                        id="user-input"
                        placeholder="Введите ваш вопрос или сообщение..."
                    ></textarea>
                </div>

                <button id="send-button">Отправить сообщение</button>

                <div class="session-controls">
                    <button id="clear-history">Очистить историю</button>
                    <button id="save-session">Сохранить сессию</button>
                    <button id="load-session">Загрузить сессию</button>
                </div>

                <div class="status info" id="status">Готов к отправке сообщения</div>
            </div>

            <div class="container">
                <h3>Диалог:</h3>
                <div class="chat-container" id="chat-container">
                    <div class="message assistant-message">
                        Привет! Я готов ответить на ваши вопросы.
                    </div>
                </div>
            </div>
            <!--Chatbot-->
        </article>
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
    --button: rgba(123, 123, 123, 0.185);

    --radius: 2em;
    --padding: 1em;
    --input-padding: 0.5em;
    --button-padding: 0.5em 1em;
    --message-padding: 0.5em 1em;
    --message-margin: 0.5em 0.5em 0.5em;
}

.container {
    h3 {
        margin-bottom: 0.8em;
        text-align: center;
        background-color: var(--header);
        margin: 0;
        padding: 0em 0.5em 0em 0.5em;
        min-height: 3em;
        min-width: 3em;
        border: solid var(--border);
        border-width: 0px 0px 1px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 1em;
    }
    h4 {
        margin-bottom: 0.8em;
        text-align: center;
        min-height: 2em;
        color: var(--theme);
        font-size: medium;
    }
    .model-info {
        p {
            text-align: center;
        }
        background-color: var(--aside-action);
        border-radius: calc(var(--radius) / 4);
        margin: 0.5em 0.5em 0.5em 0.5em;
    }
    .memory-options {
        label {
            display: flex;
            align-items: center;
            margin-bottom: 0;
        }
        input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            border-radius: 50%;
            width: 1.2em;
            height: 1.2em;
            aspect-ratio: 1;

            border: 2px solid var(--marker);
            transition: 0.2s all linear;
            outline: none;
            margin-right: 5px;
            margin-bottom: 2px;
        }
        input:checked {
            border: 4px solid var(--theme);
        }
        display: flex;
    }
    .api-key {
        visibility: collapse;
        height: 0px;
        margin: 0px;
        padding: 0px;
    }
    .chatbot-block {
        border: 1px solid var(--border);
        overflow: hidden;
    }

    .input-group {
        input[type='text'],
        textarea {
            padding: var(--input-padding);
            background-color: var(--aside-action);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: calc(var(--radius) / 4);
            font-size: 1em;
        }
        input[type='text']:focus,
        textarea:focus {
            border-color: var(--theme);
            outline: none;
        }
        textarea {
            min-height: 5em;
            font-size: 1.05em;
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        }
        max-width: 100%;
        margin: 1em 0.5em 1em 0.5em;
        display: flex;
        flex-direction: column;
    }
    #send-button {
        font-size: 1em;
        margin: 0.5em;
        padding: 0.5em;
        border: 0px;
        border-radius: 2em;
        background-color: var(--theme);
        color: var(--text);
        transition:
            0.1s ease,
            left 0.1s ease;
    }
    #send-button:hover {
        transform: scaleY(1.05);
        transform: scaleX(1.01);
        background-color: var(--accent);
    }
    .session-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        margin: 0.8em 0.5em 1em 0.5em;
    }
    .session-controls button {
        flex: 1;
        padding: 0.5em 0.1em 0.5em 0.1em;
        background-color: var(--button);
        border: 1px solid var(--border);
        color: var(--text);
        border-radius: var(--radius);
        transition:
            0.1s ease,
            left 0.1s ease;
    }
    .session-controls button:hover {
        background-color: var(--button);
        border: 3px solid var(--border-accent);
        transform: scale(1.02);
    }
    .site-url {
        visibility: collapse;
        height: 0px;
        margin: 0px;
    }
    .site-name {
        visibility: collapse;
        height: 0px;
        margin: 0px;
    }
    .chat-container {
        margin: 1em 0.5em 0.5em 0.5em;
        border: 1px solid var(--border);
        border-radius: calc(var(--radius) / 4);
        overflow-y: auto;
        background-color: var(--aside-action);
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: var(--accent) transparent;
        max-height: 80%;
        @media all and (max-width: 500px) {
            width: 100%;
            border-radius: 0;
            margin: 0;
        }
    }
    .message {
        margin: var(--message-margin);
        padding: var(--message-padding);
        border-radius: calc(var(--radius) / 4);
        line-height: 1.5;
    }

    .user-message {
        background-color: var(--header);
        border-left: 3px solid var(--theme);
    }

    .assistant-message {
        background-color: var(--aside-action);
        border-left: 3px solid var(--border-accent);
    }

    .error-message {
        background-color: var(--header);
        border-left: 3px solid var(--accent);
        color: var(--accent);
    }
    .status {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        padding: 0.5em;
        margin: 0.8em 0.5em 1em 0.5em;
        min-height: 2em;
        border-radius: calc(var(--radius) / 4);
        visibility: collapse;
    }
    .status.info {
        visibility: visible;
        background-color: var(--aside-action);
        color: var(--text);
    }

    .status.error {
        visibility: visible;
        background-color: var(--header);
        color: var(--accent);
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1em;
    overflow: hidden;
    flex-grow: 100;
    max-width: 100%;
    width: 100%;
    @media all and (max-width: 500px) {
        order: 1;
        width: 100%;
        border-radius: 0;
        margin: 0;
    }
}
</style>
