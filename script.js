document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const body = document.body;
  const toggleButton = document.getElementById("toggleSidebar");
  const piBalanceElement = document.getElementById("piBalance");
  const connectWalletButton = document.getElementById("connectWallet");

  // Toggle Sidebar
  toggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("hidden");

    if (sidebar.classList.contains("hidden")) {
      body.classList.remove("body-collapsed");
      body.classList.add("body-expanded");
    } else {
      body.classList.remove("body-expanded");
      body.classList.add("body-collapsed");
    }
  });

  // Connect Pi Wallet Function
  async function connectPiWallet() {
    try {
      const Pi = window.Pi;
      if (!Pi) {
        alert("Pi SDK not found!");
        return;
      }

      Pi.init({ version: "2.0", sandbox: false });

      const scopes = ["username", "payments"];
      const authResult = await Pi.authenticate(scopes, function (res) {
        console.log("Auth response:", res);
      });

      alert(`Welcome, ${authResult.user.username}!`);
      fetchWalletBalance(authResult.accessToken);
    } catch (error) {
      console.error("Error connecting Pi Wallet:", error);
    }
  }

  // Fetch Wallet Balance
  async function fetchWalletBalance(accessToken) {
    try {
      const apiKey = "tclbcdljvy9ikhiha3uriqdvezwmdwsezplw3asgzhgkdmd3dm0bzjeak5fgghby"; // Replace with your actual API Key
      const response = await fetch("https://api.minepi.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiKey,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      piBalanceElement.textContent = data.balance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      piBalanceElement.textContent = "Error";
    }
  }

  // Connect Wallet Button Click Event
  connectWalletButton.addEventListener("click", connectPiWallet);
});
