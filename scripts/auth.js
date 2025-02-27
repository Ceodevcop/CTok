// Register user
async function register() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = await signUp(email, password, username);
    if (user) {
        alert("Registration successful!");
        window.location.href = "dashboard.html"; // Redirect after sign-up
    }
}

// Login user
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = await signIn(email, password);
    if (user) {
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect after login
    }
}
