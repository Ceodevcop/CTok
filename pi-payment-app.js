document.addEventListener("DOMContentLoaded", async () => {
    if (!window.Pi) {
        alert("Pi Network SDK not detected. Open this in the Pi Browser.");
        return;
    }

    try {
        // Initialize Pi SDK
        Pi.init({
            version: "2.0",
            sandbox: true, // Set to true for testing
            apiKey: "bc2j9fznbipgejwz9nbe8pjat88lbycgn8ayzmagtweurnln2kuhykjvdoq9v7on"
        });

        console.log("Pi SDK initialized successfully.");

        const connectBtn = document.getElementById("connectWallet");

        connectBtn.addEventListener("click", async () => {
            try {
                // Authenticate the user
                const scopes = ["payments"];
                const authResult = await Pi.authenticate(scopes, (res) => console.log("Auth Result:", res));

                if (!authResult || !authResult.user) {
                    alert("Authentication failed. Try again.");
                    return;
                }

                console.log("User authenticated:", authResult.user.username);

                // Create a payment
                const paymentData = {
                    amount: 1, // Payment amount in Pi
                    memo: "Pi Wallet Connection Fee", // Payment memo
                    metadata: { purpose: "wallet_connection" } // Additional metadata
                };

                const payment = await Pi.createPayment(paymentData, {
                    // Simulate payment approval
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Payment pending approval:", paymentId);

                        // Simulate server-side approval (not secure for production)
                        setTimeout(() => {
                            alert("Payment approved! Waiting for completion...");
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Simulate payment completion
                    onReadyForServerCompletion: (paymentId) => {
                        console.log("Payment ready for completion:", paymentId);

                        // Simulate server-side completion (not secure for production)
                        setTimeout(() => {
                            alert("Payment completed successfully! Redirecting...");
                            window.location.href = "dashboard.html"; // Redirect after payment
                        }, 2000); // Simulate a 2-second delay
                    },

                    // Handle payment cancellation
                    onCancel: (paymentId) => {
                        alert("Payment canceled.");
                    },

                    // Handle payment errors
                    onError: (error) => {
                        console.error("Payment error:", error);
                        alert("Payment failed: " + error.message);
                    }
                });

                console.log("Payment created:", payment);

                alert("Payment initiated! Waiting for confirmation...");
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred: " + error.message);
            }
        });
    } catch (error) {
        console.error("Pi SDK Initialization Error:", error);
        alert("Failed to initialize Pi SDK: " + error.message);
    }
});
