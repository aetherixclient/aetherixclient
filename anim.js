// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Можно добавить дополнительные интерактивные функции здесь

    // Пример: Обработка кликов по кнопкам
    const resetHwidBtn = document.querySelector('.reset-hwid');
    const changePasswordBtn = document.querySelector('.change-password');

    resetHwidBtn.addEventListener('click', () => {
        alert('HWID был сброшен!');
        // Здесь можно добавить логику сброса HWID
    });

    changePasswordBtn.addEventListener('click', () => {
        alert('Переход к смене пароля.');
        // Здесь можно добавить логику смены пароля или перенаправление на другую страницу
    });
});