document.getElementById("toggleSidebar").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("hidden");
});

document.getElementById("toggleSidebar").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("hidden");
});

// Pi Wallet Connection
async function connectPiWallet() {
  const appId = "YOUR_PI_APP_ID"; // Replace with your API Key
  const scopes = ["username", "payments"];

  try {
    Pi.init({ version: "2.0", sandbox: false });
    const authResult = await Pi.authenticate(scopes, (user) => {
      console.log("User:", user);
      document.getElementById("piBalance").textContent = "Connected";
    });

    console.log("Auth Success:", authResult);
  } catch (error) {
    console.error("Pi Connection Error:", error);
  }
}
