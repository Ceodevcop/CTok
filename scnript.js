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

// DOM Elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const usernameDisplay = document.getElementById('username');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const updateProfileForm = document.getElementById('update-profile-form');

// Signup Functionality
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
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
}

// Login Functionality
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
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
}

// Logout Functionality
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        alert('Logged out successfully!');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

// Profile Functionality
if (profileUsername && profileEmail) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Fetch user data from Firestore
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            profileUsername.textContent = userData.username;
            profileEmail.textContent = userData.email;
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
}

// Update Profile Functionality
if (updateProfileForm) {
  updateProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value;

    const user = auth.currentUser;
    if (user) {
      // Update username in Firestore
      db.collection('users').doc(user.uid).update({
        username: newUsername
      })
      .then(() => {
        alert('Username updated successfully!');
        profileUsername.textContent = newUsername;
      })
      .catch((error) => {
        alert('Error updating username: ' + error.message);
      });
    } else {
      alert('User not logged in.');
    }
  });
}

// Check Auth State for All Pages
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    if (usernameDisplay) {
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            usernameDisplay.textContent = userData.username;
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  } else {
    // User is signed out
    if (window.location.pathname !== '/login.html' && window.location.pathname !== '/signup.html') {
      window.location.href = 'login.html';
    }
  }
});
