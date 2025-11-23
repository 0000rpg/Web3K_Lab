import { useTextGenerator } from '@/stores/useTextGenerator';

export function useAutoWriter() {
    const { generate, bindElement, initialize } = useTextGenerator('auto-writer');

    const setup = (element, prompt, autoTrigger = true) => {
        initialize();
        bindElement(element);

        if (autoTrigger) {
            element.addEventListener('mouseover', () => generateDescription(element, prompt));
        }

        return {
            generateDescription: () => generateDescription(element, prompt),
        };
    };

    const generateDescription = async (element, prompt) => {
        await generate({
            prompt,
            onError: (error) => {
                element.textContent = `Ошибка: ${error.message}`;
            },
        });
    };

    return { setup };
}
