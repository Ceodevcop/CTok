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

// Signup Functionality
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user data to Firestore
      db.collection('users').doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        alert('Error saving user data: ' + error.message);
      });
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login Functionality
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Fetch user data from Firestore
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            alert(`Welcome back, ${userData.username}!`);
            window.location.href = 'index.html';
          } else {
            alert('User data not found.');
          }
        })
        .catch((error) => {
          alert('Error fetching user data: ' + error.message);
        });
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Check Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    db.collection('users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          document.getElementById('username').textContent = userData.username;
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  } else {
    // User is signed out
    window.location.href = 'login.html';
  }
});

// Logout Functionality
document.getElementById('logout-button').addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});
