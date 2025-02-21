// Access the Pi object from the global window
const Pi = window.Pi;

// Initialize the Pi SDK
Pi.init({
  version: "2.0",
  sandbox: true,  // true = Test environment (Test-Pi), set to false for Production
  onReady: () => {
    console.log("Pi SDK is ready!");
  },
});

/**
 * Connect Pi Wallet:
 * Prompts user to authenticate with Pi Network (username + payments).
 */
async function connectPiWallet() {
  try {
    const scopes = ["username", "payments"];
    // 'onIncompletePaymentFound' handles any incomplete payments discovered
    const user = await Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log("User authenticated:", user);
    alert(`Welcome, ${user.username}! Your Pi wallet is connected.`);
  } catch (error) {
    console.error("Error connecting Pi wallet:", error);
    alert("Failed to connect Pi wallet.");
  }
}

/**
 * Incomplete Payment Callback:
 * This function runs if the Pi SDK detects an unfinished payment flow.
 */
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
  // You can choose to complete or cancel the payment here
}

// Example function to create a payment
async function makePayment(amount) {
  try {
    const payment = await Pi.createPayment({
      amount: amount,
      memo: "Pi-Store Payment",
      metadata: { purpose: "Web3 DApp" },
    });
    console.log("Payment created:", payment);
    alert(`Payment of ${amount} Pi created successfully!`);
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Failed to create payment.");
  }
}

// Sidebar toggle (optional if you have a toggle button in your HTML)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("collapsed");
    });
  }

  // Simulate Pi Balance (example)
  const piBalanceSpan = document.getElementById("piBalance");
  if (piBalanceSpan) {
    setTimeout(() => {
      piBalanceSpan.innerText = "3.5"; // Example balance
    }, 1000);
  }
});
