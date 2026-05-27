const bcrypt = require('bcrypt');
const fs = require('fs');

async function setup() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const initialDB = {
        users: [
            {
                id: 1,
                username: 'admin',
                passwordHash: hashedPassword,
                role: 'dispatcher'
            }
        ],
        incidents: [
            {
                id: 1,
                date: "19.05.2026",
                flight: "SU-102",
                title: "Сбой системы выпуска шасси",
                description: "Посадка в штатном режиме."
            }
        ]
    };

    fs.writeFileSync('db.json', JSON.stringify(initialDB, null, 2));
}
setup();