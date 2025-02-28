// pi-wallet-connector.js - Pi Network Wallet Integration

// Configuration Constants
const PI_CONFIG = {
  version: "2.0",
  sandbox: true, // Set to false in production
  walletAddress: "GBAYVTW4RLO3QXXG75T7EICTBCETK5CQPEI4DM3TUDOKDND5CT2KMMFU",
  supabaseUrl: "https://your-project-ref.supabase.co",
  supabaseKey: "your-anon-key"
};

// Initialize Supabase Client
const supabase = window.supabase.createClient(
  PI_CONFIG.supabaseUrl,
  PI_CONFIG.supabaseKey
);

// Initialize Pi Network SDK
function initializePiSdk() {
  try {
    if (typeof Pi === 'undefined') {
      throw new Error('Pi SDK not loaded');
    }
    
    Pi.init({
      version: PI_CONFIG.version,
      sandbox: PI_CONFIG.sandbox,
      onReady: () => console.debug('Pi SDK initialized'),
      onError: (error) => console.error('Pi SDK Error:', error)
    });
    
    return true;
  } catch (error) {
    console.error('Pi Initialization Failed:', error);
    return false;
  }
}

// Payment Handlers
const onIncompletePaymentFound = (payment) => {
  console.log('Resuming incomplete payment:', payment.identifier);
  document.getElementById('status').textContent = "Resuming pending payment...";
  handlePayment(payment);
};

const onPaymentCreated = (payment) => {
  console.log('New payment created:', payment.identifier);
  document.getElementById('status').textContent = "Payment processing...";
  handlePayment(payment);
};

const onPaymentCancelled = (payment) => {
  console.log('Payment cancelled:', payment.identifier);
  document.getElementById('status').textContent = "Payment cancelled";
};

// Core Payment Flow
async function handlePayment(payment) {
  try {
    const paymentData = await payment.waitForCompletion();
    
    if (paymentData.status === "COMPLETED") {
      document.getElementById('status').textContent = "Verifying transaction...";
      
      const verificationResult = await verifyPiPayment(paymentData.identifier);
      
      if (verificationResult.verified) {
        await storeUserData({
          uid: paymentData.user.uid,
          username: paymentData.user.username
        });
        window.location.href = '/dashboard';
      } else {
        showError(`Verification failed: ${verificationResult.message}`);
      }
    }
  } catch (error) {
    showError(`Payment processing failed: ${error.message}`);
  }
}

// Verification System
async function verifyPiPayment(paymentId) {
  try {
    const response = await fetch('/functions/v1/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });

    if (!response.ok) {
      return {
        verified: false,
        message: `Server error: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    return {
      verified: false,
      message: `Network error: ${error.message}`
    };
  }
}

// User Management
async function storeUserData(user) {
  try {
    const { error } = await supabase.from('users').upsert({
      uid: user.uid,
      username: user.username,
      pi_wallet: PI_CONFIG.walletAddress,
      last_login: new Date().toISOString()
    }, { onConflict: 'uid' });

    if (error) throw error;
  } catch (error) {
    console.error('User storage failed:', error);
    throw new Error('Failed to save user data');
  }
}

// UI Helpers
function showError(message) {
  console.error(message);
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.style.color = 'red';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  if (!initializePiSdk()) {
    showError('Pi Browser required - please open in Pi Browser');
    return;
  }

  document.getElementById('connectWallet').addEventListener('click', async () => {
    try {
      const authResult = await Pi.authenticate(
        ['username', 'payments', 'payments.write'],
        onIncompletePaymentFound
      );

      if (authResult?.user?.uid) {
        const payment = await Pi.createPayment({
          amount: 1,
          memo: "C-Tok Registration",
          metadata: { uid: authResult.user.uid },
          to_address: PI_CONFIG.walletAddress
        }, onPaymentCreated, onPaymentCancelled);
      }
    } catch (error) {
      showError(`Authentication failed: ${error.message}`);
    }
  });
});
