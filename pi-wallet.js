/*document.getElementById("connect-wallet").addEventListener("click", function() {
    const apiKey = "ku2pc1gatt21dvcucrjakhogw8mtvot8wrjmqylc4kutjcoihkbfcz4q0wivlz4h";
    alert("Connecting to Pi Wallet... API Key: " + apiKey);
    document.getElementById("wallet-status").innerText = "Wallet Connected!";
});
*/
// pi-wallet.js
document.getElementById("connect-wallet")?.addEventListener("click", function() {
  const apiKey = "ku2pc1gatt21dvcucrjakhogw8mtvot8wrjmqylc4kutjcoihkbfcz4q0wivlz4h";
  // Simulate wallet connection and 1 Pi payment for account creation
  const confirmed = confirm("Connecting your wallet requires a 1 Pi payment to create your account. Proceed?");
  if (confirmed) {
    alert("Wallet connected and account created successfully.");
    document.getElementById("wallet-status").innerText = "Wallet Connected";
    // Optionally, update wallet balance here or trigger an API call
  } else {
    alert("Wallet connection canceled.");
  }
});
 
