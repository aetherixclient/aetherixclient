document.getElementById('loginBtn').addEventListener('click', async () => {
    console.log('Login button clicked');  // Отладочный вывод

    const username = document.querySelector('.loginbox').value;
    const passwordInput = document.querySelector('.passbox').value;

    console.log('Username:', username);  // Отладочный вывод
    console.log('Password:', passwordInput);  // Отладочный вывод

    // URL для доступа к файлу UserData.txt через GitHub API
    const userDataUrl = `https://api.github.com/repos/aetherixclient/TX-PROGRAM-CLIENT/contents/Users/${username}/UserData.txt`;

    const token = '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'; // Ваш токен GitHub

    try {
        // Получаем содержимое файла UserData.txt с использованием GitHub API
        const response = await fetch(userDataUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3.raw' // Этот заголовок указывает, что мы хотим получить сырой контент файла
            }
        });

        if (!response.ok) {
            throw new Error('User does not exist or file is not accessible');
        }

        const text = await response.text();
        // Разбиваем содержимое файла на строки
        const lines = text.split('\n');

        // Проверка пароля (предполагаем, что пароль находится на 2-й строке)
        const storedPassword = lines[1].trim();

        // Сравниваем введенный пароль с сохраненным
        if (storedPassword === passwordInput) {
            console.log('Login successful');
            // Успех, сохраняем имя пользователя в sessionStorage
            sessionStorage.setItem('nickname', username);
            // Перенаправление на страницу uscab.html
            window.location.href = 'uscab.html';
        } else {
            alert('Failed: Incorrect password');
        }
    } catch (error) {
        alert('Failed: ' + error.message);
    }
});
