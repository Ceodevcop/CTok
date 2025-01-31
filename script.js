// Sign Up
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
        db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: role,
            points: 0
        }).then(() => {
            alert('Sign up successful!');
            window.location.href = 'profile.html';
        }).catch((error) => {
            console.error('Error adding document: ', error);
        });
    }).catch((error) => {
        console.error('Error creating user: ', error);
    });
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password).then(() => {
        alert('Login successful!');
        window.location.href = 'profile.html';
    }).catch((error) => {
        console.error('Error logging in: ', error);
    });
});