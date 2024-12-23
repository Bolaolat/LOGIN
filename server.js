const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const userPaths = {}; // Store paths for users based on IP

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to get user IP
app.use((req, res, next) => {
  req.userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  next();
});

// Create a path for the user
app.post('/create-path', (req, res) => {
  const userIp = req.userIp;
  const dirPath = path.join(__dirname, 'user_dirs', userIp.replace(/[:.]/g, '_'));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  userPaths[userIp] = dirPath;
  res.json({ message: 'Path created', path: dirPath });
});

// Clone a repository
app.post('/clone', (req, res) => {
  const { repoUrl } = req.body;
  const userIp = req.userIp;
  const userPath = userPaths[userIp];

  if (!userPath) {
    return res.status(400).json({ error: 'Path not created for this user' });
  }

  const gitClone = spawn('git', ['clone', repoUrl, userPath]);

  let logs = '';
  gitClone.stdout.on('data', (data) => {
    logs += data.toString();
  });

  gitClone.stderr.on('data', (data) => {
    logs += data.toString();
  });

  gitClone.on('close', (code) => {
    if (code === 0) {
      const yarnInstall = spawn('yarn', ['install'], { cwd: userPath });

      yarnInstall.stdout.on('data', (data) => {
        logs += data.toString();
      });

      yarnInstall.stderr.on('data', (data) => {
        logs += data.toString();
      });

      yarnInstall.on('close', (code) => {
        if (code === 0) {
          res.json({ message: 'Yarn install completed successfully.', logs });
        } else {
          res.status(500).json({ message: 'Yarn install failed.', logs });
        }
      });
    } else {
      res.status(500).json({ message: 'Git clone failed.', logs });
    }
  });
});

// Run commands
app.post('/run-command', (req, res) => {
  const { command } = req.body;
  const userIp = req.userIp;
  const userPath = userPaths[userIp];

  if (!userPath) {
    return res.status(400).json({ error: 'Path not created for this user' });
  }

  const cmd = spawn(command, { cwd: userPath, shell: true });

  let logs = '';
  cmd.stdout.on('data', (data) => {
    logs += data.toString();
  });

  cmd.stderr.on('data', (data) => {
    logs += data.toString();
  });

  cmd.on('close', (code) => {
    res.json({ message: `Command exited with code ${code}`, logs });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
