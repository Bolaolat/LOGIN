const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const usersDir = path.join(__dirname, 'users');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from "public" folder

// Ensure users directory exists
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
}

// Clone repository
app.post('/clone', (req, res) => {
    const { repoUrl, userId } = req.body;
    const userDir = path.join(usersDir, userId);

    if (!repoUrl) {
        return res.status(400).send('Repository URL is required.');
    }

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    const gitClone = spawn('git', ['clone', repoUrl, '.'], { cwd: userDir });

    gitClone.stdout.on('data', (data) => console.log(`GIT OUTPUT: ${data}`));
    gitClone.stderr.on('data', (data) => console.error(`GIT ERROR: ${data}`));

    gitClone.on('close', (code) => {
        if (code === 0) {
            res.send('Repository cloned successfully!');
        } else {
            res.status(500).send('Error cloning repository.');
        }
    });
});

// Install dependencies
app.post('/install', (req, res) => {
    const { userId } = req.body;
    const userDir = path.join(usersDir, userId);

    if (!fs.existsSync(userDir)) {
        return res.status(400).send('User directory not found.');
    }

    const yarnInstall = spawn('yarn', ['install'], { cwd: userDir });

    yarnInstall.stdout.on('data', (data) => console.log(`YARN OUTPUT: ${data}`));
    yarnInstall.stderr.on('data', (data) => console.error(`YARN ERROR: ${data}`));

    yarnInstall.on('close', (code) => {
        if (code === 0) {
            res.send('Dependencies installed successfully!');
        } else {
            res.status(500).send('Error installing dependencies.');
        }
    });
});

// Run a script
app.post('/run', (req, res) => {
    const { userId, filename } = req.body;
    const filePath = path.join(usersDir, userId, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(400).send('File not found.');
    }

    const nodeProcess = spawn('node', [filePath]);

    let output = '';
    nodeProcess.stdout.on('data', (data) => (output += data));
    nodeProcess.stderr.on('data', (data) => (output += data));

    nodeProcess.on('close', (code) => {
        if (code === 0) {
            res.send(`Script executed successfully!\n\n${output}`);
        } else {
            res.status(500).send(`Error executing script.\n\n${output}`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
