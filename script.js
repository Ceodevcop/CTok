document.getElementById('signup-form').addEventListener('submit', (e) => {
     e.preventDefault();
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;

     // Create user with email and password
     auth.createUserWithEmailAndPassword(email, password)
       .then((userCredential) => {
         alert('Signup successful! Please login.');
         window.location.href = 'login.html';
       })
       .catch((error) => {
         alert(error.message);
       });
   });
   document.getElementById('login-form').addEventListener('submit', (e) => {
     e.preventDefault();
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;

     // Sign in with email and password
     auth.signInWithEmailAndPassword(email, password)
       .then((userCredential) => {
         alert('Login successful!');
         window.location.href = 'index.html';
       })
       .catch((error) => {
         alert(error.message);
       });
   });
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
     