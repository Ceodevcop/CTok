// Global Pi object (loaded from https://sdk.minepi.com/pi-sdk.js)
const Pi = window.Pi;

// Initialize Pi SDK
Pi.init({
  version: "2.0",
  sandbox: true, // set to false for production
  onReady: () => {
    console.log("Pi SDK is ready!");
  }
});

// On DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle
  const toggleBtn = document.getElementById("toggleSidebar");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("collapsed");
    });
  }

  // Simulate Pi Balance
  const piBalanceSpan = document.getElementById("piBalance");
  if (piBalanceSpan) {
    setTimeout(() => {
      piBalanceSpan.innerText = "3.5"; // Example balance
    }, 1000);
  }
});

// Connect Pi Wallet
async function connectPiWallet() {
  try {
    const scopes = ["username", "payments"];
    const user = await Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log("User authenticated:", user);
    alert(`Welcome, ${user.username}!`);
  } catch (error) {
    console.error("Pi Wallet Connection Error:", error);
    alert("Failed to connect Pi wallet.");
  }
}

// Handle incomplete payments
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
  // Optionally handle or complete the payment
}

// Upload Asset (Placeholder)
function uploadAsset() {
  const file = document.getElementById("assetFile").files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }
  alert(`Asset '${file.name}' uploaded (placeholder).`);
}

// Invest Pi (Placeholder Payment)
async function investPi() {
  const amountInput = document.getElementById("investAmount");
  if (!amountInput) return;
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 5 || amount > 100) {
    alert("Please enter a valid amount between 5 and 100 Pi.");
    return;
  }
  try {
    const payment = await Pi.createPayment({
      amount: amount,
      memo: "Pi-Store Investment",
      metadata: { type: "investment" },
    });
    console.log("Payment created:", payment);
    alert(`Investment of ${amount} Pi created successfully!`);
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Failed to create investment payment.");
  }
}

// Swap Pi to Naira (Placeholder)
function swapPi() {
  const input = document.getElementById("swapAmount");
  const result = document.getElementById("swapResult");
  if (!input || !result) return;
  const piAmount = parseFloat(input.value);
  if (isNaN(piAmount) || piAmount <= 0) {
    result.innerText = "Enter a valid Pi amount.";
    return;
  }
  const rate = 0.25; // Example rate
  const naira = piAmount * rate;
  result.innerText = `You will receive ₦${naira.toFixed(2)} (placeholder).`;
}
