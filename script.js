function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email, password }));
        alert("User registered successfully!");
    } else {
        alert("Please enter valid details.");
    }
}

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
        alert("Login successful!");
    } else {
        alert("Invalid credentials.");
    }
}
