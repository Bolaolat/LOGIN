const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const usersFile = path.join(__dirname, 'users.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure users.json exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
}

// API: Create Account
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    if (usersData.users.find(user => user.username === username)) {
        return res.status(400).send('Username already exists.');
    }

    usersData.users.push({ username, password });
    fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
    res.send('Account created successfully.');
});

// API: Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const user = usersData.users.find(
        user => user.username === username && user.password === password
    );

    if (user) {
        res.send('Login successful.');
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
