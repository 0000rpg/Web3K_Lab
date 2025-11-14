import os
import glob

def create_context_file():
    # Получаем список всех файлов в текущей директории (без вложенных папок)
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    
    # Исключаем сам файл context.txt, чтобы не включать его в результат
    if 'context.txt' in files:
        files.remove('context.txt')
    
    # Сортируем файлы для удобства
    files.sort()
    
    # Создаем или перезаписываем файл context.txt
    with open('context.txt', 'w', encoding='utf-8') as output_file:
        for filename in files:
            # Записываем название файла как разделитель
            output_file.write(f"\n{'='*50}\n")
            output_file.write(f"ФАЙЛ: {filename}\n")
            output_file.write(f"{'='*50}\n\n")
            
            try:
                # Пытаемся прочитать файл в текстовом режиме
                with open(filename, 'r', encoding='utf-8') as input_file:
                    content = input_file.read()
                    output_file.write(content)
                    
            except UnicodeDecodeError:
                # Если файл бинарный, сообщаем об этом
                output_file.write("[БИНАРНЫЙ ФАЙЛ - СОДЕРЖИМОЕ НЕ МОЖЕТ БЫТЬ ПРОЧИТАНО]\n")
            except Exception as e:
                # Обрабатываем другие возможные ошибки
                output_file.write(f"[ОШИБКА ПРИ ЧТЕНИИ ФАЙЛА: {str(e)}]\n")
            
            # Добавляем пустую строку между файлами для читабельности
            output_file.write("\n\n")

if __name__ == "__main__":
    create_context_file()
    print("Файл context.txt успешно создан!")