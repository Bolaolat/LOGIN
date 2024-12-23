const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock server status
let serverStatus = {
  address: "DEMONX:2003",
  uptime: "10H 20MIN",
  cpuLoad: "20079/0",
  memory: "90TB",
  disk: "894.83 MiB / 700.53 GiB",
  networkInbound: "666",
};

// API to get server info
app.get('/server-info', (req, res) => {
  res.json(serverStatus);
});

// API to handle server actions
app.post('/server-action', (req, res) => {
  const { action } = req.body;

  // Mock handling actions
  if (action === 'start') {
    serverStatus.uptime = "5 minutes";
    serverStatus.cpuLoad = "15%";
    serverStatus.memory = "2 GB / 4 GB";
    serverStatus.networkInbound = "120 KB/s";
    res.json({ message: 'Server started' });
  } else if (action === 'restart') {
    serverStatus.uptime = "Restarting...";
    setTimeout(() => {
      serverStatus.uptime = "1 minute";
    }, 2000);
    res.json({ message: 'Server restarted' });
  } else if (action === 'stop') {
    serverStatus.uptime = "Offline";
    serverStatus.cpuLoad = "Offline";
    serverStatus.memory = "Offline";
    serverStatus.networkInbound = "Offline";
    res.json({ message: 'Server stopped' });
  } else {
    res.status(400).json({ message: 'Invalid action' });
  }
});

// API to handle command input
app.post('/command', (req, res) => {
  const { command } = req.body;

  // Mock command output
  if (command) {
    res.json({ output: `Executed: ${command}` });
  } else {
    res.status(400).json({ error: 'No command provided' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
