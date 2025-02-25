const apiKey = "ku2pc1gatt21dvcucrjakhogw8mtvot8wrjmqylc4kutjcoihkbfcz4q0wivlz4h"; // Your Pi API Key
const pi = window.Pi;

document.getElementById("connectWallet").addEventListener("click", async () => {
    try {
        // Authenticate with Pi Network
        const scopes = ["username", "payments"];
        const auth = await pi.authenticate(scopes);
        const { user } = auth;
        
        if (!user) {
            alert("Authentication failed. Please try again.");
            return;
        }

        // Request 1 Pi Payment
        const payment = await pi.createPayment({
            amount: 1,
            memo: "Pi-Store Account Activation",
            metadata: { userId: user.uid }
        });

        if (payment.status === "completed") {
            alert("Payment successful! Redirecting to dashboard...");
            window.location.href = "dashboard.html?user=" + user.username;
        } else {
            alert("Payment failed. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
    }
});
