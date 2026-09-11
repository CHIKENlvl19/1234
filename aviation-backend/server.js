const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';
const activeTokens = new Map();

async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: токен не предоставлен' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeTokens.has(token)) {
        return res.status(401).json({ error: 'Unauthorized: недействительный токен' });
    }
    req.userId = activeTokens.get(token);
    next();
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await readDB();
        const user = db.users.find(u => u.username === username);
        if (!user) return res.json([]);

        const match = await bcrypt.compare(String(password), String(user.passwordHash));
        if (match) {
            const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
            activeTokens.set(token, user.id);
            res.json([{ id: user.id, username: user.username, role: user.role, token }]);
        }
        else res.json([]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        activeTokens.delete(token);
    }
    res.json({ message: 'Logged out' });
});

app.get('/users', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        const safeUsers = db.users.map(u => ({ id: u.id, username: u.username, role: u.role }));
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/users', authMiddleware, async (req, res) => {
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

app.delete('/users/:id', authMiddleware, async (req, res) => {
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

app.get('/incidents', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.incidents);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/incidents/:id', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        const incident = db.incidents.find(i => i.id === req.params.id);
        if (incident) res.json(incident);
        else res.status(404).json({ error: 'Not found' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/incidents', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        const newIncident = { id: Date.now().toString(), ...req.body };
        const maxId = db.incidents.reduce((max, i) => Math.max(max, Number(i.id) || 0), 0);
        const newIncident = { id: String(maxId + 1), ...req.body };
        db.incidents.push(newIncident);
        await writeDB(db);
        res.status(201).json(newIncident);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/incidents/:id', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        const index = db.incidents.findIndex(i => i.id === req.params.id);
        if (index !== -1) {
            db.incidents[index] = { ...db.incidents[index], ...req.body, id: req.params.id };
            await writeDB(db);
            res.json(db.incidents[index]);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/incidents/:id', authMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        const filteredIncidents = db.incidents.filter(i => i.id !== req.params.id);
        if (db.incidents.length !== filteredIncidents.length) {
            db.incidents = filteredIncidents;
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
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));