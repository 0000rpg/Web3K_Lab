# git_helper.py
import os
import sys
import json
import subprocess
import urllib.request
import urllib.error
from configparser import ConfigParser
from pathlib import Path
from typing import Optional, List, Dict, Any

class GitHelper:
    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.config_file = os.path.join(self.project_root, 'git_config.ini')
        self.config = ConfigParser()
        self.load_config()
        
    def load_config(self) -> None:
        """Загрузка конфигурации из файла"""
        if os.path.exists(self.config_file):
            self.config.read(self.config_file)
        else:
            self.create_default_config()
    
    def create_default_config(self) -> None:
        """Создание конфигурации по умолчанию"""
        self.config['DEFAULT'] = {
            'enabled_commands': 'status,add,commit,push,pull,branch,merge,clone,init',
            'auto_add': 'true',
            'require_commit_message': 'true',
            'default_remote': 'origin',
            'default_branch': 'main'
        }
        
        self.config['USER'] = {
            'name': '',
            'email': '',
            'github_username': ''
        }
        
        self.config['REPOSITORY'] = {
            'url': '',
            'api_key': '',
            'ssh_key_path': ''
        }
        
        self.save_config()
        print(f"Создан файл конфигурации: {self.config_file}")
        print("Пожалуйста, настройте его перед использованием.")
    
    def save_config(self) -> None:
        """Сохранение конфигурации в файл"""
        with open(self.config_file, 'w', encoding='utf-8') as f:
            self.config.write(f)
    
    def check_git_installed(self) -> bool:
        """Проверка установлен ли Git"""
        try:
            subprocess.run(['git', '--version'], check=True, capture_output=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def check_internet_connection(self) -> bool:
        """Проверка подключения к интернету"""
        try:
            urllib.request.urlopen('https://github.com', timeout=5)
            return True
        except urllib.error.URLError:
            return False
    
    def run_git_command(self, command: List[str], check: bool = True) -> tuple:
        """Выполнение Git команды"""
        try:
            result = subprocess.run(
                ['git'] + command,
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=check
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.CalledProcessError as e:
            return e.returncode, e.stdout, e.stderr
    
    def is_git_repository(self) -> bool:
        """Проверка является ли директория Git репозиторием"""
        git_dir = os.path.join(self.project_root, '.git')
        return os.path.exists(git_dir)
    
    def get_current_branch(self) -> str:
        """Получение текущей ветки"""
        returncode, stdout, stderr = self.run_git_command(['branch', '--show-current'], check=False)
        if returncode == 0:
            return stdout.strip()
        return "unknown"
    
    def get_remote_url(self) -> str:
        """Получение URL удаленного репозитория"""
        returncode, stdout, stderr = self.run_git_command(['remote', 'get-url', 'origin'], check=False)
        if returncode == 0:
            return stdout.strip()
        return ""
    
    def configure_user(self) -> None:
        """Настройка пользователя Git"""
        if self.config['USER']['name']:
            self.run_git_command(['config', 'user.name', self.config['USER']['name']])
        if self.config['USER']['email']:
            self.run_git_command(['config', 'user.email', self.config['USER']['email']])
    
    def show_status(self) -> None:
        """Показать статус репозитория"""
        print("\n=== СТАТУС РЕПОЗИТОРИЯ ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        current_branch = self.get_current_branch()
        remote_url = self.get_remote_url()
        
        print(f"📁 Директория: {self.project_root}")
        print(f"🌿 Ветка: {current_branch}")
        print(f"🌐 Удаленный репозиторий: {remote_url if remote_url else 'не настроен'}")
        
        returncode, stdout, stderr = self.run_git_command(['status'], check=False)
        if returncode == 0:
            print(f"\n{stdout}")
        else:
            print(f"Ошибка при получении статуса: {stderr}")
    
    def add_files(self) -> None:
        """Добавить файлы в индекс"""
        print("\n=== ДОБАВЛЕНИЕ ФАЙЛОВ ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        # Показать изменения
        self.run_git_command(['status'])
        
        choice = input("\nВыберите действие:\n1 - Добавить все файлы\n2 - Выбрать файлы вручную\n3 - Отмена\n> ")
        
        if choice == '1':
            returncode, stdout, stderr = self.run_git_command(['add', '.'])
            if returncode == 0:
                print("✅ Все файлы добавлены в индекс")
            else:
                print(f"❌ Ошибка: {stderr}")
        elif choice == '2':
            files = input("Введите имена файлов через пробел: ")
            if files.strip():
                file_list = files.split()
                returncode, stdout, stderr = self.run_git_command(['add'] + file_list)
                if returncode == 0:
                    print("✅ Файлы добавлены в индекс")
                else:
                    print(f"❌ Ошибка: {stderr}")
    
    def commit_changes(self) -> None:
        """Создать коммит"""
        print("\n=== СОЗДАНИЕ КОММИТА ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        # Проверить есть ли что коммитить
        returncode, stdout, stderr = self.run_git_command(['status', '--porcelain'])
        if not stdout.strip():
            print("❌ Нет изменений для коммита")
            return
        
        print("Изменения для коммита:")
        self.run_git_command(['status'])
        
        message = input("\nВведите сообщение коммита: ").strip()
        
        if not message and self.config.getboolean('DEFAULT', 'require_commit_message', fallback=True):
            print("❌ Сообщение коммита обязательно!")
            return
        
        if message:
            returncode, stdout, stderr = self.run_git_command(['commit', '-m', message])
        else:
            returncode, stdout, stderr = self.run_git_command(['commit'])
        
        if returncode == 0:
            print("✅ Коммит создан успешно")
        else:
            print(f"❌ Ошибка при создании коммита: {stderr}")
    
    def push_changes(self) -> None:
        """Отправить изменения в удаленный репозиторий"""
        print("\n=== ОТПРАВКА ИЗМЕНЕНИЙ ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        if not self.check_internet_connection():
            print("⚠️  Отсутствует подключение к интернету")
            return
        
        current_branch = self.get_current_branch()
        remote = self.config['DEFAULT'].get('default_remote', 'origin')
        
        print(f"Отправка ветки '{current_branch}' в '{remote}'...")
        
        returncode, stdout, stderr = self.run_git_command(['push', '-u', remote, current_branch])
        
        if returncode == 0:
            print("✅ Изменения успешно отправлены")
        else:
            print(f"❌ Ошибка при отправке: {stderr}")
            print("Проверьте настройки удаленного репозитория и права доступа")
    
    def pull_changes(self) -> None:
        """Получить изменения из удаленного репозитория"""
        print("\n=== ПОЛУЧЕНИЕ ИЗМЕНЕНИЙ ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        if not self.check_internet_connection():
            print("⚠️  Отсутствует подключение к интернету")
            return
        
        remote = self.config['DEFAULT'].get('default_remote', 'origin')
        current_branch = self.get_current_branch()
        
        print(f"Получение изменений из '{remote}/{current_branch}'...")
        
        returncode, stdout, stderr = self.run_git_command(['pull', remote, current_branch])
        
        if returncode == 0:
            print("✅ Изменения успешно получены")
        else:
            print(f"❌ Ошибка при получении изменений: {stderr}")
    
    def manage_branches(self) -> None:
        """Управление ветками"""
        print("\n=== УПРАВЛЕНИЕ ВЕТКАМИ ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        while True:
            print(f"\nТекущая ветка: {self.get_current_branch()}")
            print("\n1 - Показать все ветки")
            print("2 - Создать новую ветку")
            print("3 - Переключиться на ветку")
            print("4 - Удалить ветку")
            print("5 - Назад")
            
            choice = input("> ")
            
            if choice == '1':
                returncode, stdout, stderr = self.run_git_command(['branch', '-a'])
                if returncode == 0:
                    print(f"\n{stdout}")
            elif choice == '2':
                branch_name = input("Введите имя новой ветки: ").strip()
                if branch_name:
                    returncode, stdout, stderr = self.run_git_command(['checkout', '-b', branch_name])
                    if returncode == 0:
                        print(f"✅ Ветка '{branch_name}' создана и активирована")
                    else:
                        print(f"❌ Ошибка: {stderr}")
            elif choice == '3':
                branch_name = input("Введите имя ветки для переключения: ").strip()
                if branch_name:
                    returncode, stdout, stderr = self.run_git_command(['checkout', branch_name])
                    if returncode == 0:
                        print(f"✅ Переключено на ветку '{branch_name}'")
                    else:
                        print(f"❌ Ошибка: {stderr}")
            elif choice == '4':
                branch_name = input("Введите имя ветки для удаления: ").strip()
                if branch_name:
                    if branch_name == self.get_current_branch():
                        print("❌ Нельзя удалить текущую ветку")
                        continue
                    
                    force = input("Принудительное удаление? (y/n): ").lower() == 'y'
                    command = ['branch', '-D' if force else '-d', branch_name]
                    returncode, stdout, stderr = self.run_git_command(command)
                    
                    if returncode == 0:
                        print(f"✅ Ветка '{branch_name}' удалена")
                    else:
                        print(f"❌ Ошибка: {stderr}")
            elif choice == '5':
                break
    
    def merge_branch(self) -> None:
        """Слияние веток"""
        print("\n=== СЛИЯНИЕ ВЕТОК ===")
        
        if not self.is_git_repository():
            print("❌ Текущая директория не является Git репозиторием")
            return
        
        branch_name = input("Введите имя ветки для слияния: ").strip()
        if not branch_name:
            return
        
        print(f"Слияние ветки '{branch_name}' в текущую ветку...")
        
        returncode, stdout, stderr = self.run_git_command(['merge', branch_name])
        
        if returncode == 0:
            print("✅ Слияние выполнено успешно")
        else:
            print(f"❌ Ошибка при слиянии: {stderr}")
            print("Возникли конфликты. Пожалуйста, разрешите их вручную.")
    
    def init_repository(self) -> None:
        """Инициализация нового репозитория"""
        print("\n=== ИНИЦИАЛИЗАЦИЯ РЕПОЗИТОРИЯ ===")
        
        if self.is_git_repository():
            print("❌ Git репозиторий уже инициализирован в этой директории")
            return
        
        returncode, stdout, stderr = self.run_git_command(['init'])
        
        if returncode == 0:
            print("✅ Git репозиторий инициализирован")
            self.configure_user()
            
            # Добавить удаленный репозиторий если указан в конфиге
            repo_url = self.config['REPOSITORY'].get('url', '')
            if repo_url:
                self.run_git_command(['remote', 'add', 'origin', repo_url])
                print(f"✅ Добавлен удаленный репозиторий: {repo_url}")
        else:
            print(f"❌ Ошибка при инициализации: {stderr}")
    
    def clone_repository(self) -> None:
        """Клонирование репозитория"""
        print("\n=== КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ ===")
        
        if not self.check_internet_connection():
            print("⚠️  Отсутствует подключение к интернету")
            return
        
        repo_url = input("Введите URL репозитория: ").strip()
        if not repo_url:
            return
        
        target_dir = input("Введите целевую директорию (пусто для текущей): ").strip()
        clone_path = target_dir if target_dir else self.project_root
        
        print(f"Клонирование {repo_url} в {clone_path}...")
        
        try:
            returncode, stdout, stderr = self.run_git_command(['clone', repo_url, clone_path])
            
            if returncode == 0:
                print("✅ Репозиторий успешно клонирован")
                # Обновляем рабочую директорию если клонировали в текущую
                if not target_dir:
                    self.project_root = os.path.join(self.project_root, 
                                                   repo_url.split('/')[-1].replace('.git', ''))
            else:
                print(f"❌ Ошибка при клонировании: {stderr}")
        except Exception as e:
            print(f"❌ Ошибка: {e}")
    
    def configure_settings(self) -> None:
        """Настройка параметров"""
        print("\n=== НАСТРОЙКИ ===")
        
        while True:
            print(f"\nТекущие настройки:")
            print(f"1 - Имя пользователя: {self.config['USER'].get('name', 'не установлено')}")
            print(f"2 - Email: {self.config['USER'].get('email', 'не установлен')}")
            print(f"3 - GitHub username: {self.config['USER'].get('github_username', 'не установлен')}")
            print(f"4 - URL репозитория: {self.config['REPOSITORY'].get('url', 'не установлен')}")
            print(f"5 - API ключ: {'установлен' if self.config['REPOSITORY'].get('api_key') else 'не установлен'}")
            print(f"6 - Включенные команды: {self.config['DEFAULT'].get('enabled_commands', '')}")
            print("7 - Сохранить и выйти")
            print("8 - Выйти без сохранения")
            
            choice = input("> ")
            
            if choice == '1':
                name = input("Введите имя пользователя: ").strip()
                if name:
                    self.config['USER']['name'] = name
            elif choice == '2':
                email = input("Введите email: ").strip()
                if email:
                    self.config['USER']['email'] = email
            elif choice == '3':
                username = input("Введите GitHub username: ").strip()
                if username:
                    self.config['USER']['github_username'] = username
            elif choice == '4':
                url = input("Введите URL репозитория: ").strip()
                if url:
                    self.config['REPOSITORY']['url'] = url
            elif choice == '5':
                api_key = input("Введите API ключ: ").strip()
                if api_key:
                    self.config['REPOSITORY']['api_key'] = api_key
            elif choice == '6':
                commands = input("Введите команды через запятую: ").strip()
                if commands:
                    self.config['DEFAULT']['enabled_commands'] = commands
            elif choice == '7':
                self.save_config()
                print("✅ Настройки сохранены")
                break
            elif choice == '8':
                break
    
    def show_menu(self) -> None:
        """Главное меню"""
        while True:
            print("\n" + "="*50)
            print("🎯 GIT HELPER - УПРАВЛЕНИЕ РЕПОЗИТОРИЕМ")
            print("="*50)
            
            if not self.check_git_installed():
                print("❌ Git не установлен или не найден в PATH")
                print("Пожалуйста, установите Git и перезапустите программу")
                input("Нажмите Enter для выхода...")
                return
            
            # Информация о текущем состоянии
            if self.is_git_repository():
                branch = self.get_current_branch()
                print(f"📁 Репозиторий: {os.path.basename(self.project_root)}")
                print(f"🌿 Ветка: {branch}")
                print(f"🌐 Интернет: {'✅' if self.check_internet_connection() else '❌'}")
            else:
                print("📁 Директория не является Git репозиторием")
            
            print("\nДоступные команды:")
            
            enabled_commands = self.config['DEFAULT'].get('enabled_commands', '').split(',')
            menu_items = []
            
            if 'status' in enabled_commands:
                menu_items.append(("1", "📊 Статус репозитория", self.show_status))
            if 'add' in enabled_commands:
                menu_items.append(("2", "📁 Добавить файлы", self.add_files))
            if 'commit' in enabled_commands:
                menu_items.append(("3", "💾 Создать коммит", self.commit_changes))
            if 'push' in enabled_commands:
                menu_items.append(("4", "⬆️  Отправить изменения", self.push_changes))
            if 'pull' in enabled_commands:
                menu_items.append(("5", "⬇️  Получить изменения", self.pull_changes))
            if 'branch' in enabled_commands:
                menu_items.append(("6", "🌿 Управление ветками", self.manage_branches))
            if 'merge' in enabled_commands:
                menu_items.append(("7", "🔄 Слияние веток", self.merge_branch))
            if 'init' in enabled_commands:
                menu_items.append(("8", "🚀 Инициализировать репозиторий", self.init_repository))
            if 'clone' in enabled_commands:
                menu_items.append(("9", "📥 Клонировать репозиторий", self.clone_repository))
            
            menu_items.append(("c", "⚙️  Настройки", self.configure_settings))
            menu_items.append(("q", "❌ Выход", None))
            
            for key, description, _ in menu_items:
                print(f"{key} - {description}")
            
            choice = input("\nВыберите действие: ").lower()
            
            if choice == 'q':
                print("До свидания! 👋")
                break
            
            for key, description, action in menu_items:
                if choice == key and action:
                    try:
                        action()
                    except Exception as e:
                        print(f"❌ Произошла ошибка: {e}")
                    break
            else:
                print("❌ Неверный выбор. Попробуйте снова.")

def main():
    """Главная функция"""
    # Проверяем передан ли путь к проекту
    project_root = sys.argv[1] if len(sys.argv) > 1 else None
    
    helper = GitHelper(project_root)
    helper.show_menu()

if __name__ == "__main__":
    main()