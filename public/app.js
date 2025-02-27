document.addEventListener('DOMContentLoaded', () => {
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
        to_address: "YOUR_PI_WALLET_ADDRESS"
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
