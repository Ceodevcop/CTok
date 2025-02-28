// pi-wallet.js - Pi Network Wallet Integration

// Initialize Supabase
const supabase = createClient(
  'https://your-project-ref.supabase.co',
  'your-anon-key'
)

// Pi Network Configuration
const PI_CONFIG = {
  version: "2.0",
  sandbox: true, // Switch to false for production
  walletAddress: "YOUR_PI_WALLET_ADDRESS"
}

// Initialize Pi SDK
Pi.init(PI_CONFIG)

// DOM Elements
const connectButton = document.getElementById('connectWallet')
const statusElement = document.getElementById('status')

// Payment Handlers
const handlePaymentCreation = (payment) => {
  console.log('Payment created:', payment)
  statusElement.textContent = "Processing payment..."
  trackPaymentStatus(payment)
}

const handleIncompletePayment = (payment) => {
  console.log('Found incomplete payment:', payment)
  statusElement.textContent = "Resuming pending payment..."
  trackPaymentStatus(payment)
}

const handlePaymentCancellation = (payment) => {
  console.log('Payment cancelled:', payment)
  statusElement.textContent = "Payment cancelled by user"
}

// Core Functions
async function handlePiAuth() {
  try {
    statusElement.textContent = "Starting Pi authentication..."
    
    const authResult = await Pi.authenticate(
      ['username', 'payments'],
      handleIncompletePayment
    )

    if (authResult?.user) {
      statusElement.textContent = "Creating payment request..."
      await createPiPayment(authResult.user)
    }
  } catch (error) {
    statusElement.textContent = `Authentication failed: ${error.message}`
  }
}

async function createPiPayment(user) {
  try {
    const payment = await Pi.createPayment(
      {
        amount: 1,
        memo: "C-Tok Registration",
        metadata: { uid: user.uid },
        to_address: PI_CONFIG.walletAddress
      },
      handlePaymentCreation,
      handlePaymentCancellation
    )

    return payment
  } catch (error) {
    statusElement.textContent = `Payment creation failed: ${error.message}`
  }
}

async function trackPaymentStatus(payment) {
  try {
    const paymentData = await payment.waitForCompletion()
    
    if (paymentData.status === "COMPLETED") {
      statusElement.textContent = "Verifying transaction..."
      const isVerified = await verifyPiPayment(paymentData.identifier)
      
      if (isVerified) {
        await storeUserData(paymentData.user)
        window.location.href = '/dashboard'
      }
    }
  } catch (error) {
    statusElement.textContent = `Payment processing error: ${error.message}`
  }
}

async function verifyPiPayment(paymentId) {
  try {
    const response = await fetch('/functions/v1/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    })

    if (!response.ok) return false
    const { verified } = await response.json()
    return verified
  } catch (error) {
    console.error('Verification error:', error)
    return false
  }
}

async function storeUserData(user) {
  try {
    const { error } = await supabase.from('users').upsert({
      uid: user.uid,
      username: user.username,
      pi_address: PI_CONFIG.walletAddress,
      last_login: new Date().toISOString()
    }, { onConflict: 'uid' })

    if (error) throw error
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('Failed to save user data')
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  connectButton.addEventListener('click', handlePiAuth)
}) 
  
/*document.addEventListener('DOMContentLoaded', () => {
  const connectButton = document.getElementById('connectWallet')
  const statusElement = document.getElementById('status')

  // Initialize Pi Network
  Pi.init({ version: "2.0", sandbox: true })

  connectButton.addEventListener('click', async () => {
    try {
      statusElement.textContent = "Initializing Pi authentication..."
      
      // Pi Network Authentication
      const authResult = await Pi.authenticate(['username', 'payments'], onPaymentCreated)
      
      if (authResult) {
        await handlePiPayment(authResult.user)
      }
    } catch (error) {
      statusElement.textContent = `Error: ${error.message}`
    }
  })

  async function handlePiPayment(user) {
    try {
      statusElement.textContent = "Creating payment..."
      
      // Create Pi Payment
      const payment = await Pi.createPayment({
        amount: 1,
        memo: "C-Tok Registration",
        metadata: { uid: user.uid },
        to_address: "GBAYVTW4RLO3QXXG75T7EICTBCETK5CQPEI4DM3TUDOKDND5CT2KMMFU"
      })

      if (payment.status === "COMPLETED") {
        statusElement.textContent = "Verifying payment..."
        
        // Verify payment via Edge Function
        const isVerified = await verifyPayment(payment.identifier)
        
        if (isVerified) {
          await saveUserToDatabase(user)
          window.location.href = '/dashboard'
        }
      }
    } catch (error) {
      statusElement.textContent = `Payment Error: ${error.message}`
    }
  }

  async function verifyPayment(paymentId) {
    const response = await fetch('/functions/v1/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    })
    
    if (!response.ok) return false
    const { verified } = await response.json()
    return verified
  }

  async function saveUserToDatabase(user) {
    const { error } = await supabase.from('users').upsert({
      uid: user.uid,
      username: user.username,
      last_login: new Date().toISOString()
    }, { onConflict: 'uid' })

    if (error) throw error
  }
})
