// Supabase configuration
const SUPABASE_URL = "https://cqrnlcrpnyyhxghqwpnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcm5sY3Jwbnl5aHhnaHF3cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTc2OTgsImV4cCI6MjA1NTk3MzY5OH0.ZWYjte3-RHGV3Td7z3cdS3M6toHaMFqJSPJ0iFVd2X4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
document.getElementById("connectWallet").addEventListener("click", async () => {
    try {
        if (typeof Pi === "undefined") {
            throw new Error("Pi SDK is not loaded. Please open this in Pi Browser.");
        }

        const scopes = ["username", "payments"];
        const authResult = await Pi.authenticate(scopes, (res) => res);

        if (!authResult || !authResult.user) {
            throw new Error("Authentication failed. Please try again.");
        }

        document.getElementById("status").innerText = "Wallet connected! Verifying transaction...";

        // Continue with transaction verification
    } catch (error) {
        console.error("Authentication error:", error);
        document.getElementById("status").innerText = "Error connecting wallet: " + error.message;
    }
});
