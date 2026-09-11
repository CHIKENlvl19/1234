const bcrypt = require('bcrypt');
const fs = require('fs');

async function setup() {
    const oldUsers = [
        { id: "1", username: "admin", password: "Password123", role: "admin" },
        { id: "2", username: "ivanov", password: "disp123", role: "dispatcher" }
    ];

    const incidents = [
        {
            id: "1",
            flightNumber: "SU-2130",
            incidentType: "Сбой систем контроля доступа",
            severity: "Критический",
            location: "КПП авиационной безопасности",
            status: "В процессе расследования",
            inspector: "Петров А.И."
        },
        {
            id: "2",
            flightNumber: "SU-123",
            incidentType: "Обнаружение опасных предметов",
            severity: "Высокий",
            location: "Терминал",
            status: "Зарегистрирован",
            inspector: "Сидоров В.К."
        },
        {
            id: "3",
            flightNumber: "AFL-2234",
            incidentType: "Несанкционированное проникновение",
            severity: "Критический",
            location: "Зона стоянки ВС",
            status: "Устранен",
            inspector: "Козлов Д.М."
        },
        {
            id: "4",
            flightNumber: "SU-2356",
            incidentType: "Нарушение предполетного досмотра",
            severity: "Средний",
            location: "Перрон",
            status: "Закрыт",
            inspector: "Иванова Е.С."
        }
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
