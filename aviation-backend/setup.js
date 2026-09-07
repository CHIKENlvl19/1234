const bcrypt = require('bcrypt');
const fs = require('fs');

async function setup() {

    const oldUsers = [
        { id: "1", username: "admin", password: "Password123", role: "admin" },
        { id: "2", username: "ivanov", password: "disp123", role: "dispatcher" }
    ];


    const incidents = [
        { id: "1", flightNumber: "SU-2130", incidentType: "Отказ датчика скорости", severity: "Критический", detectionDate: "2026-05-18", description: "Расхождение показаний скорости." },
        { flightNumber: "SU-123", incidentType: "Утечка топлива", severity: "Низкий", id: "wQQYNX5lucE" },
        { flightNumber: "SU-223", incidentType: "Boom", severity: "Критический", id: "bkWRFkX" },
        { flightNumber: "SU-2356", incidentType: "Отказ автопилота", severity: "Средний", id: "BqYvsJH" }
    ];

    console.log('Начинаю хеширование паролей...');
    
    const usersWithHashes = [];
    for (const user of oldUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        usersWithHashes.push({
            id: user.id,
            username: user.username,
            passwordHash: hashedPassword,
            role: user.role
        });
        console.log(`Пароль для пользователя ${user.username} успешно захеширован.`);
    }

    const initialDB = {
        users: usersWithHashes,
        incidents: incidents
    };

    fs.writeFileSync('db.json', JSON.stringify(initialDB, null, 2));
    console.log('Файл db.json успешно сгенерирован!');
}

setup();
