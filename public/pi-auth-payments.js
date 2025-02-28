// pi-auth-payments.js - Pi Network Integration

// === Configuration =============================================
const CONFIG = {
  // Pi Network Settings
  pi: {
    version: "2.0",
    sandbox: true, // Set false in production
    walletAddress: "GBAYVTW4RLO3QXXG75T7EICTBCETK5CQPEI4DM3TUDOKDND5CT2KMMFU",
    validScopes: ['username', 'payments'] // Valid scope order
  },
  
  // Supabase Settings
  supabase: {
    url: "https://cqrnlcrpnyyhxghqwpnm.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcm5sY3Jwbnl5aHhnaHF3cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTc2OTgsImV4cCI6MjA1NTk3MzY5OH0.ZWYjte3-RHGV3Td7z3cdS3M6toHaMFqJSPJ0iFVd2X4",
    table: "users"
  }
};

// === Initialization =============================================
// Initialize Supabase
const supabase = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.key
);

// Initialize Pi SDK
function initializePi() {
  try {
    if (typeof Pi === 'undefined') {
      throw new Error('Pi SDK not loaded');
    }
    
    Pi.init({
      version: CONFIG.pi.version,
      sandbox: CONFIG.pi.sandbox,
      onReady: () => console.log('Pi SDK Ready'),
      onError: (error) => showError(`SDK Error: ${error.message}`)
    });
    
    return true;
  } catch (error) {
    showError('Pi Browser Required');
    return false;
  }
}

// === Core Functions =============================================
async function handleAuthentication() {
  try {
    updateStatus('Authenticating...');
    
    const authResult = await Pi.authenticate(
      CONFIG.pi.validScopes,
      handleIncompletePayment
    );

    if (!authResult?.user?.uid) {
      throw new Error('Authentication failed - no user data');
    }

    return authResult.user;
  } catch (error) {
    showError(`Auth Failed: ${error.message}`);
    throw error;
  }
}

async function createPiPayment(user) {
  try {
    updateStatus('Creating payment...');
    
    return await Pi.createPayment({
      amount: 1,
      memo: "Account Verification",
      metadata: { uid: user.uid },
      to_address: CONFIG.pi.walletAddress
    }, 
    handleNewPayment,
    handlePaymentCancel);
  } catch (error) {
    showError(`Payment Error: ${error.message}`);
    throw error;
  }
}

// === Payment Handlers ===========================================
async function handleIncompletePayment(payment) {
  try {
    updateStatus('Resuming payment...');
    const result = await payment.waitForCompletion();
    await verifyAndStorePayment(result);
  } catch (error) {
    showError(`Payment Error: ${error.message}`);
  }
}

async function handleNewPayment(payment) {
  try {
    updateStatus('Processing payment...');
    const result = await payment.waitForCompletion();
    await verifyAndStorePayment(result);
  } catch (error) {
    showError(`Payment Error: ${error.message}`);
  }
}

function handlePaymentCancel(payment) {
  console.log('Payment cancelled:', payment.identifier);
  updateStatus('Payment cancelled');
}

// === Verification & Storage =====================================
async function verifyAndStorePayment(paymentData) {
  try {
    if (paymentData.status !== "COMPLETED") {
      throw new Error('Payment not completed');
    }

    updateStatus('Verifying...');
    const verification = await verifyPayment(paymentData.identifier);
    
    if (!verification.valid) {
      throw new Error('Payment verification failed');
    }

    await storeUser({
      uid: paymentData.user.uid,
      username: paymentData.user.username
    });

    window.location.href = '/dashboard';
  } catch (error) {
    showError(error.message);
  }
}

async function verifyPayment(paymentId) {
  try {
    const response = await fetch('/functions/v1/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });

    return await response.json();
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function storeUser(user) {
  try {
    const { error } = await supabase
      .from(CONFIG.supabase.table)
      .upsert({
        uid: user.uid,
        username: user.username,
        registered_at: new Date().toISOString()
      }, { onConflict: 'uid' });

    if (error) throw error;
  } catch (error) {
    throw new Error('User storage failed');
  }
}

// === UI Helpers =================================================
function updateStatus(message) {
  const element = document.getElementById('status');
  if (element) {
    element.textContent = message;
    element.style.color = 'black';
  }
}

function showError(message) {
  console.error(message);
  const element = document.getElementById('status');
  if (element) {
    element.textContent = message;
    element.style.color = 'red';
  }
}

// === Event Listeners ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (!initializePi()) return;

  document.getElementById('connectWallet').addEventListener('click', async () => {
    try {
      const user = await handleAuthentication();
      await createPiPayment(user);
    } catch (error) {
      console.error('Main flow error:', error);
    }
  });
});

/*
// pi-wallet-connector.js - Pi Network Wallet Integration

// Configuration Constants
const PI_CONFIG = {
  version: "2.0",
  sandbox: true, // Set to false in production
  walletAddress: "GBAYVTW4RLO3QXXG75T7EICTBCETK5CQPEI4DM3TUDOKDND5CT2KMMFU",
  supabaseUrl: "https://cqrnlcrpnyyhxghqwpnm.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcm5sY3Jwbnl5aHhnaHF3cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTc2OTgsImV4cCI6MjA1NTk3MzY5OH0.ZWYjte3-RHGV3Td7z3cdS3M6toHaMFqJSPJ0iFVd2X4"
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
