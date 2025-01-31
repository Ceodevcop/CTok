// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1eKzgwOTIZMMIUfbEDQBqgmY88cQCfy0",
  authDomain: "ctok-app.firebaseapp.com",
  projectId: "ctok-app",
  storageBucket: "ctok-app.firebasestorage.app",
  messagingSenderId: "991407836421",
  appId: "1:991407836421:web:5f8c275e0168ba573ffb6c"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('profileLink').style.display = 'block';
        document.getElementById('logoutLink').style.display = 'block';
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
    } else {
        document.getElementById('profileLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'none';
        document.getElementById('loginLink').style.display = 'block';
        document.getElementById('signupLink').style.display = 'block';
    }
});

// Logout
document.getElementById('logoutLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        alert('You have been logged out.');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});