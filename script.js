// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Dashboard: Transaction form handling
  const transactionForm = document.getElementById('transaction-form');
  if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('transaction-type').value;
      const amount = parseFloat(document.getElementById('amount').value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      // Simulate processing the transaction
      document.getElementById('transaction-result').innerText =
        `Transaction: ${type.toUpperCase()} ${amount} Pi processed successfully.`;
      updateWalletBalance(type, amount);
    });
  }

  // Invest page: Investment form handling
  const investForm = document.getElementById('invest-form');
  if (investForm) {
    investForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('invest-amount').value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid investment amount.');
        return;
      }
      // Calculate 5% ROI
      const roi = amount * 0.05;
      document.getElementById('invest-result').innerText =
        `Investment successful! In 24 hours, you will earn an additional ${roi.toFixed(2)} Pi.`;
    });
  }

  // Trade page: Trade form handling
  const tradeForm = document.getElementById('trade-form');
  if (tradeForm) {
    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('trade-type').value;
      const amount = parseFloat(document.getElementById('trade-amount').value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid trade amount.');
        return;
      }
      document.getElementById('trade-result').innerText =
        `Trade executed: ${type.toUpperCase()} ${amount} Pi.`;
    });
  }

  // Wallet balance refresh button
  const refreshButton = document.getElementById('refresh-balance');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      fetchWalletBalance();
    });
  }

  // Market page: Load dummy market data
  const marketDataDiv = document.getElementById('market-data');
  if (marketDataDiv) {
    loadMarketData();
  }
});

// Dummy wallet balance simulation
let walletBalance = 100.0; // Starting balance

function fetchWalletBalance() {
  // Simulate an API call delay
  setTimeout(() => {
    document.getElementById('wallet-balance').innerText = `Balance: ${walletBalance.toFixed(2)} Pi`;
  }, 500);
}

function updateWalletBalance(transactionType, amount) {
  if (transactionType === 'buy') {
    walletBalance += amount;
  } else if (transactionType === 'sell') {
    walletBalance = Math.max(0, walletBalance - amount);
  }
  fetchWalletBalance();
}

function loadMarketData() {
  // Simulated market data
  const data = {
    currentPrice: 1.0, // For simulation: 1 Pi = 1 local currency unit
    dailyChange: 0.02, // 2% change
    volume: 5000
  };
  const marketDataDiv = document.getElementById('market-data');
  marketDataDiv.innerHTML = `
    <p>Current Price: ${data.currentPrice} LC per Pi</p>
    <p>Daily Change: ${(data.dailyChange * 100).toFixed(2)}%</p>
    <p>Trading Volume: ${data.volume} Pi</p>
  `;
}
