// text-generator.js
export class TextGenerator {
    constructor(apiKey, baseURL = 'https://openrouter.ai/api/v1/chat/completions') {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.abortController = null;
    }

    /**
     * Генерирует текст с возможностью получения ответа в реальном времени
     * @param {Object} options - Опции генерации
     * @param {string} options.prompt - Текст промпта
     * @param {Array} options.messages - История сообщений (альтернатива prompt)
     * @param {string} options.model - Модель для генерации
     * @param {Function} options.onText - Колбек для получения текста в реальном времени
     * @param {Function} options.onComplete - Колбек при завершении
     * @param {Function} options.onError - Колбек при ошибке
     * @param {Object} options.headers - Дополнительные заголовки
     * @returns {Promise<string>} - Полный сгенерированный текст
     */
    async generateStream(options = {}) {
        const {
            prompt,
            messages = [],
            model = 'openai/gpt-oss-20b:free',
            onText = () => {},
            onComplete = () => {},
            onError = () => {},
            headers = {},
        } = options;

        // Отменяем предыдущий запрос если есть
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();
        let fullText = '';

        try {
            const requestBody = {
                model,
                messages: prompt ? [{ role: 'user', content: prompt }] : messages,
                stream: true,
            };

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(requestBody),
                signal: this.abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.replace('data: ', '').trim();

                        if (data === '[DONE]') {
                            onComplete(fullText);
                            return fullText;
                        }

                        try {
                            const json = JSON.parse(data);
                            const delta = json.choices[0]?.delta?.content || '';

                            if (delta) {
                                fullText += delta;
                                onText(delta, fullText);
                            }
                        } catch (e) {
                            console.warn('Parse warning:', e, line);
                        }
                    }
                }
            }

            onComplete(fullText);
            return fullText;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
                return fullText;
            }

            onError(error);
            throw error;
        } finally {
            this.abortController = null;
        }
    }

    /**
     * Генерирует текст без потоковой передачи (один ответ)
     * @param {Object} options - Опции генерации
     * @returns {Promise<string>} - Сгенерированный текст
     */
    async generate(options = {}) {
        const { prompt, messages = [], model = 'openai/gpt-oss-20b:free', headers = {} } = options;

        const requestBody = {
            model,
            messages: prompt ? [{ role: 'user', content: prompt }] : messages,
            stream: false,
        };

        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    /**
     * Отменяет текущую генерацию
     */
    abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    /**
     * Создает экземпляр генератора с настройками по умолчанию
     * @param {string} apiKey - API ключ
     * @param {string} defaultModel - Модель по умолчанию
     * @returns {TextGenerator}
     */
    static create(apiKey, defaultModel = 'openai/gpt-oss-20b:free') {
        const generator = new TextGenerator(apiKey);
        generator.defaultModel = defaultModel;
        return generator;
    }
}

// Пример использования в Vue компоненте/сторе:
/*
import { TextGenerator } from '@/utils/text-generator.js';

// В компоненте Vue
export default {
  data() {
    return {
      generator: null,
      generatedText: '',
      isGenerating: false
    }
  },
  created() {
    this.generator = new TextGenerator('your-api-key');
  },
  methods: {
    async generateDescription() {
      this.isGenerating = true;
      this.generatedText = '';

      try {
        await this.generator.generateStream({
          prompt: "Опиши смешную историю из жизни программиста",
          onText: (chunk, fullText) => {
            this.generatedText = fullText;
          },
          onComplete: (fullText) => {
            this.isGenerating = false;
            console.log('Generation completed:', fullText);
          },
          onError: (error) => {
            this.isGenerating = false;
            console.error('Generation failed:', error);
          }
        });
      } catch (error) {
        this.isGenerating = false;
      }
    },

    stopGeneration() {
      this.generator.abort();
      this.isGenerating = false;
    }
  }
}
*/

// Пример использования в Pinia store:
/*
import { defineStore } from 'pinia';
import { TextGenerator } from '@/utils/text-generator.js';

export const useTextGenerationStore = defineStore('textGeneration', {
  state: () => ({
    generator: null,
    currentText: '',
    isGenerating: false,
    error: null
  }),

  actions: {
    initialize(apiKey) {
      this.generator = TextGenerator.create(apiKey);
    },

    async generateText(prompt, options = {}) {
      if (!this.generator) throw new Error('Generator not initialized');

      this.isGenerating = true;
      this.error = null;
      this.currentText = '';

      try {
        return await this.generator.generateStream({
          prompt,
          onText: (chunk, fullText) => {
            this.currentText = fullText;
          },
          onComplete: (fullText) => {
            this.isGenerating = false;
            return fullText;
          },
          onError: (error) => {
            this.isGenerating = false;
            this.error = error.message;
            throw error;
          },
          ...options
        });
      } catch (error) {
        this.isGenerating = false;
        this.error = error.message;
        throw error;
      }
    },

    abortGeneration() {
      if (this.generator) {
        this.generator.abort();
        this.isGenerating = false;
      }
    }
  }
});
*/
