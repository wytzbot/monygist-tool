import { Client, Account } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.1/+esm";

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')  // NYC region
    .setProject('6a4580c700274964d612');

const account = new Account(client);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const authSection = document.getElementById('auth-section');

// Login with Google
loginBtn.addEventListener('click', () => {
    account.createOAuth2Session(
        'google',
        'https://wytzbot.github.io/monygist-tool/', // success - must have trailing /
        'https://wytzbot.github.io/monygist-tool/'  // failure - must have trailing /
    );
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await account.deleteSession('current');
        checkAuth();
    } catch (error) {
        console.error('Logout failed:', error);
    }
});

// Check if user is logged in
async function checkAuth() {
    try {
        const user = await account.get();
        // User is logged in
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        userInfo.style.display = 'block';
        authSection.style.display = 'none';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } catch (error) {
        // User is not logged in
        userInfo.style.display = '
