// src/components/PaymentForm.js
import React, { useState } from 'react';
import api from '../services/api';

const PaymentForm = ({ user, setPaymentStatus }) => {
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [metadata, setMetadata] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const paymentData = {
        user_uid: user.uid,
        amount,
        memo,
        metadata,
      };

      // Create payment
      const { payment_id } = await api.createPayment(paymentData);
      setPaymentStatus({ status: 'created', payment_id });

      // Submit payment
      const { txid } = await api.submitPayment(payment_id);
      setPaymentStatus({ status: 'submitted', payment_id, txid });

      // Complete payment
      const payment = await api.completePayment(payment_id, txid);
      setPaymentStatus({ status: 'completed', payment });
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus({ status: 'failed', error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Metadata (JSON)"
        value={JSON.stringify(metadata)}
        onChange={(e) => setMetadata(JSON.parse(e.target.value))}
        required
      />
      <button type="submit">Pay with Pi</button>
    </form>
  );
};

export default PaymentForm;
