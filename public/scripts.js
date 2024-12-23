const createAccountForm = document.getElementById('createAccountForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

// Function to display messages
function showMessage(message, isError = false) {
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = isError ? '#dc3545' : '#28a745';
    messageDiv.innerText = message;

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Handle Create Account
createAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const message = await response.text();
        if (response.ok) {
            showMessage(message);
        } else {
            showMessage(message, true);
        }
    } catch (err) {
        showMessage('An error occurred. Please try again.', true);
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const message = await response.text();
        if (response.ok) {
            showMessage(message);
        } else {
            showMessage(message, true);
        }
    } catch (err) {
        showMessage('An error occurred. Please try again.', true);
    }
});
