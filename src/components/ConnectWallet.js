// src/components/ConnectWallet.js
import React from 'react';
import { Pi } from '@pinetwork-js/sdk';

const ConnectWallet = ({ setUser }) => {
  const handleConnectWallet = async () => {
    try {
      const authResult = await Pi.authenticate(['payments'], onIncompletePayment);
      setUser(authResult.user);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const onIncompletePayment = (paymentId) => {
    console.log('Incomplete payment:', paymentId);
  };

  return (
    <button onClick={handleConnectWallet}>Connect Wallet</button>
  );
};

export default ConnectWallet;
