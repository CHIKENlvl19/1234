const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const db = await readDB();
        const user = db.users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        
        if (match) {
            res.json({ id: user.id, username: user.username, role: user.role });
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/incidents', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.incidents);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/users', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const db = await readDB();
        
        const hashedPassword = await bcrypt.hash(String(password), 10);
        
        const newUser = {
            id: Date.now().toString(),
            username: username,
            passwordHash: hashedPassword,
            role: role
        };
        
        db.users.push(newUser);
        await writeDB(db);
        res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const db = await readDB();
        const filteredUsers = db.users.filter(u => u.id !== req.params.id);
        
        if (db.users.length !== filteredUsers.length) {
            db.users = filteredUsers;
            await writeDB(db);
            res.json({});
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {});