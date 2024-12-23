async function createPath() {
  const response = await fetch('/create-path', { method: 'POST' });
  const data = await response.json();
  alert(data.message);
}

async function cloneRepo() {
  const repoUrl = document.getElementById('repo-url').value;
  const response = await fetch('/clone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl }),
  });
  const data = await response.json();
  displayLogs(data.logs || data.message);
}

async function runCommand() {
  const command = document.getElementById('command').value;
  const response = await fetch('/run-command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  const data = await response.json();
  displayLogs(data.logs || data.message);
}

function displayLogs(logs) {
  const logOutput = document.getElementById('log-output');
  logOutput.textContent += logs + '\n';
  logOutput.scrollTop = logOutput.scrollHeight;
}
