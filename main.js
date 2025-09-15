// Получаем элементы со страницы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');

// Проверяем, что все элементы найдены
if (!dlg || !openBtn || !closeBtn || !form) {
    console.error('Не найдены необходимые элементы на странице:');
    console.log('dlg:', dlg);
    console.log('openBtn:', openBtn);
    console.log('closeBtn:', closeBtn);
    console.log('form:', form);
    // Прекращаем выполнение скрипта
    throw new Error('Не найдены элементы для работы модального окна');
}

let lastActive = null;

// Остальной код без изменений...
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement; // Запоминаем активный элемент
    dlg.showModal(); // Показываем модальное окно с подложкой

    // Переносим фокус на первый интерактивный элемент внутри модалки
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Обработчик закрытия модалки по кнопке
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработчик отправки формы
form.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений об ошибках
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений (required, type, pattern)
    if (!form.checkValidity()) {
        e.preventDefault(); // Отменяем стандартное поведение (закрытие dialog)

        // Пример кастомной ошибки для email
        const emailField = form.elements.email;
        if (emailField.validity.typeMismatch) {
            emailField.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity(); // Показываем браузерные сообщения об ошибках

        // Помечаем поля с ошибками для стилизации
        [...form.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });
        return; // Прерываем выполнение функции
    }

    // 3) Если форма валидна, предотвращаем отправку (т.к. сервера нет) и закрываем модалку
    e.preventDefault();
    alert('Форма успешно отправлена! (Это заглушка, серверная часть не реализована)'); // Сообщение об успехе
    dlg.close('success'); // Закрываем модальное окно
    form.reset(); // Очищаем форму
});

// Событие, которое срабатывает при закрытии модалки (любым способом)
dlg.addEventListener('close', () => {
    lastActive?.focus(); // Возвращаем фокус на кнопку, которая открыла модалку
});