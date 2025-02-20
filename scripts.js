// Load the Pi Network SDK dynamically
(function loadPiSDK() {
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = initPiSDK;
    document.head.appendChild(script);
})();

// Initialize the Pi SDK
function initPiSDK() {
    const PiNetwork = window.Pi;
    PiNetwork.init({ version: "2.0" })
        .then(() => console.log("Pi SDK Initialized"))
        .catch(err => console.error("Initialization failed:", err));

    // Attach payment function to button
    document.addEventListener("DOMContentLoaded", () => {
        const payButton = document.getElementById("payButton");
        if (payButton) payButton.addEventListener("click", processPayment);
    });
}

// Function to process a payment
async function processPayment() {
    try {
        const PiNetwork = window.Pi;
        if (!PiNetwork) {
            console.error("Pi SDK not loaded");
            return;
        }

        const payment = await PiNetwork.createPayment({
            amount: 1,  // Amount in Pi
            memo: "Test Transaction", // Description
            metadata: { orderId: "12345" } // Metadata
        });

        console.log("Payment initiated:", payment);
        
        // Wait for payment completion
        const result = await payment.complete();
        console.log("Payment completed:", result);
        alert("Payment successful!");
    } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed! Check console for details.");
    }
}
 
