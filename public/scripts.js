// Fetch server info and update the UI
async function fetchServerInfo() {
  const response = await fetch('/server-info');
  const data = await response.json();

  document.querySelector('#address').textContent = data.address;
  document.querySelector('#uptime').textContent = data.uptime;
  document.querySelector('#cpu-load').textContent = data.cpuLoad;
  document.querySelector('#memory').textContent = data.memory;
  document.querySelector('#disk').textContent = data.disk;
  document.querySelector('#network-inbound').textContent = data.networkInbound;
}

// Handle server actions
async function handleAction(action) {
  const response = await fetch('/server-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  const data = await response.json();
  alert(data.message);
  fetchServerInfo();
}

// Handle command input
async function handleCommand() {
  const commandInput = document.querySelector('#command-input').value;
  const response = await fetch('/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: commandInput }),
  });
  const data = await response.json();
  const logOutput = document.querySelector('#log-output');
  logOutput.textContent += `${data.output}\n`;
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Initialize
fetchServerInfo();
