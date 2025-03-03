// src/App.js
import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import PaymentForm from './components/PaymentForm';
import PaymentStatus from './components/PaymentStatus';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  return (
    <div className="App">
      <h1>C-Tok Platform</h1>
      <ConnectWallet setUser={setUser} />
      {user && <PaymentForm user={user} setPaymentStatus={setPaymentStatus} />}
      {paymentStatus && <PaymentStatus paymentStatus={paymentStatus} />}
    </div>
  );
}

export default App;
