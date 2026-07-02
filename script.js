import { Client, Account } from 'https://cdn.jsdelivr.net/npm/appwrite@15.0.0/+esm';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6a4580c700274964d612');

const account = new Account(client);

// Login button
document.getElementById('google-login')?.addEventListener('click', () => {
    account.createOAuth2Session(
        'google',
        'https://wytzbot.github.io/monygist-tool/',  // Success URL - FIXED
        'https://wytzbot.github.io/monygist-tool/'   // Fail URL - FIXED
    );
});

// Check login status on page load
async function init() {
    try {
        const user = await account.get();
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
    } catch (e) {
        console.log('Not logged in');
    }
}

// Logout button
document.getElementById('logout')?.addEventListener('click', async () => {
    await account.deleteSession('current');
    location.reload();
});

init();
