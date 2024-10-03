class Api {
    constructor() {
        this.baseUrl = "https://api.github.com/repos/aetherixclient/TX-PROGRAM-CLIENT/contents/Users";
        this.token = "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";
    }

    async createRequestOptions(method, body = null) {
        const headers = {
            "Authorization": `token ${this.token}`,
            "User-Agent": "TX-Program-Client",
            "Content-Type": "application/json"
        };

        const options = {
            method: method,
            headers: headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return options;
    }

    async getUserData(username) {
        const url = `${this.baseUrl}/${username}/UserData.txt`;
        const options = await this.createRequestOptions('GET');

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Failed to retrieve user data.");
        }

        const data = await response.json();
        const decodedContent = atob(data.content);
        return decodedContent;
    }
    async saveUserData(username, content) {
        const url = `${this.baseUrl}/${username}/UserData.txt`;
        const encodedContent = btoa(content);

        const requestData = {
            message: "Update user data",
            content: encodedContent,
            committer: {
                name: "API",
                email: "api@tx-client.com"
            }
        };

        const options = await this.createRequestOptions('PUT', requestData);

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Failed to save user data.");
        }
    }

    async register(username, password) {
        try {
            // Проверка, существует ли пользователь
            const existingUser = await this.getUserData(username);
            if (existingUser) {
                return { success: false, message: 'Пользователь уже существует.' }; // Сообщение об ошибке
            }

            // Генерируем контент для нового пользователя
            const defaultContent = `${username}\n${password}\n${this.generateGUID()}\nS-1-5-21-${Math.floor(Math.random() * 100000)}\n192.168.1.1\nLIFETIME\n${new Date().toISOString().split('T')[0]}\n${new Date().toISOString().split('T')[0]}\nUSER\n0\n0\n0\n0`;
            await this.saveUserData(username, defaultContent);

            return { success: true, message: 'Регистрация успешна!' }; // Возвращаем успех
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return { success: false, message: 'Произошла ошибка при регистрации.' }; // Обработка ошибок
        }
    }

    async login(username, password) {
        try {
            const content = await this.getUserData(username);
            if (!content) {
                return { success: false, message: 'Пользователь не найден.' }; // Сообщение об ошибке
            }

            const lines = content.split('\n');

            if (lines[1] !== password) {
                return { success: false, message: 'Неверный пароль.' }; // Сообщение об ошибке
            }

            // Обновляем дату последнего входа
            lines[7] = new Date().toISOString().split('T')[0];
            await this.saveUserData(username, lines.join('\n'));

            return { success: true, message: 'Логин успешен!' }; // Возвращаем успех
        } catch (error) {
            console.error('Ошибка при логине:', error);
            return { success: false, message: 'Произошла ошибка при логине.' }; // Обработка ошибок
        }
    }

    async getHWID(username) {
        const content = await this.getUserData(username);
        return content.split('\n')[3]; // Возвращаем HWID
    }

    async getIP(username) {
        const content = await this.getUserData(username);
        return content.split('\n')[4]; // Возвращаем IP
    }

    async getRegDate(username) {
        const content = await this.getUserData(username);
        return content.split('\n')[6]; // Возвращаем дату регистрации
    }

    async changePassword(username, oldPassword, newPassword) {
        const content = await this.getUserData(username);
        const lines = content.split('\n');

        if (lines[1] !== oldPassword) {
            throw new Error("Invalid old password.");
        }

        // Меняем пароль
        lines[1] = newPassword;
        await this.saveUserData(username, lines.join('\n'));
    }

    async resetHWID(username, password) {
        const content = await this.getUserData(username);
        const lines = content.split('\n');

        if (lines[1] !== password) {
            throw new Error("Invalid password.");
        }

        // Сбрасываем HWID
        lines[3] = `S-1-5-21-${Math.floor(Math.random() * 100000)}`;
        await this.saveUserData(username, lines.join('\n'));
    }

    // Генерация уникального идентификатора (GUID)
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
