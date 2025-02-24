
// script.js
function initializeSidebar() {
  // Sidebar toggle functionality
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // Store state in localStorage
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Load initial state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    sidebar.classList.toggle('collapsed', isCollapsed);
  }

  // Update active link based on current page
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Initialize Pi SDK and sidebar when component loads
document.addEventListener('DOMContentLoaded', () => {
  // Pi SDK Initialization
  Pi.init({
    version: "2.0",
    sandbox: true,
    onReady: () => {
      console.log("Pi SDK is ready!");
      // Load real balance when SDK is ready
      loadPiBalance();
    },
  });

  // Initialize balance display
  const piBalanceSpan = document.getElementById('piBalance');
  if (piBalanceSpan) {
    piBalanceSpan.innerText = localStorage.getItem('piBalance') || 'Loading...';
  }
});

async function loadPiBalance() {
  // Simulated balance update - replace with actual API call
  setTimeout(() => {
    const balance = '3.5'; // Example balance
    document.querySelectorAll('#piBalance').forEach(element => {
      element.innerText = balance;
    });
    localStorage.setItem('piBalance', balance);
  }, 1000);
}

// Keep existing Pi functions (connectPiWallet, makePayment, etc.)
// ...// script.js (updated)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-active");
    });
  }

  // Pi Balance Simulation (replace with real data)
  const piBalanceSpan = document.getElementById("piBalance");
  if (piBalanceSpan) {
    Pi.getBalance().then(balance => {
      piBalanceSpan.textContent = balance.toFixed(2);
    }).catch(() => {
      piBalanceSpan.textContent = "3.14"; // Fallback
    });
  }
});

// Keep your existing Pi SDK functions...
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
