document.getElementById('repoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const repoUrl = document.getElementById('repoUrl').value;

    try {
        const response = await fetch('/clone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, repoUrl })
        });
        const message = await response.text();
        document.getElementById('output').innerText = message;
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('scriptForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const filename = document.getElementById('filename').value;

    try {
        const response = await fetch('/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, filename })
        });
        const message = await response.text();
        document.getElementById('output').innerText = message;
    } catch (err) {
        console.error(err);
    }
});
