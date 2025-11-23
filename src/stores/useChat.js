import { useTextGenerator } from '@/stores/useTextGenerator';
import { ref, computed } from 'vue';

export function useChat() {
    const { generate, initialize, isGenerating } = useTextGenerator('chat');
    const messages = ref([]);
    const input = ref('');

    const sendMessage = async () => {
        if (!input.value.trim() || isGenerating.value) return;

        const userMessage = { role: 'user', content: input.value };
        messages.value.push(userMessage);

        const assistantMessage = { role: 'assistant', content: '' };
        messages.value.push(assistantMessage);

        const currentInput = input.value;
        input.value = '';

        try {
            await generate({
                messages: messages.value,
                onText: (chunk, fullText) => {
                    assistantMessage.content = fullText;
                },
            });
        } catch (error) {
            assistantMessage.content = `Ошибка: ${error.message}`;
        }
    };

    return {
        messages,
        input,
        sendMessage,
        isGenerating,
    };
}
