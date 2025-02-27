// Supabase configuration
const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to sign up a new user
async function signUp(email, password, username) {
    let { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.error("Signup error:", error.message);
        return null;
    }
    await supabase.from("users").insert([{ id: user.id, username, email }]);
    return user;
}

// Function to log in
async function signIn(email, password) {
    let { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error("Login error:", error.message);
        return null;
    }
    return user;
}

// Function to log out
async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "login.html"; // Redirect to login after logout
}
