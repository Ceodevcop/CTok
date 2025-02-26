const { Pi } = window;

// Initialize Pi SDK
Pi.init({ version: "2.0", sandbox: true });

// Login Function
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const scopes = ["username", "payments"];
        const user = await Pi.authenticate(scopes, (payment) => {
            console.log("Incomplete payment:", payment);
        });
        console.log("User:", user);
        alert(`Welcome, ${user.username}`);
    } catch (error) {
        console.error("Login failed:", error);
    }
});

// Payment Function
document.getElementById("payBtn").addEventListener("click", async () => {
    try {
        const payment = await Pi.createPayment({
            amount: 1,
            memo: "C-Tok trade payment",
            metadata: { purpose: "Trade on C-Tok" },
        });
        console.log("Payment created:", payment);
        alert("Payment initiated!");
    } catch (error) {
        console.error("Payment error:", error);
    }
});
