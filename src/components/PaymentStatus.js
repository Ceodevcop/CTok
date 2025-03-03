// src/components/PaymentStatus.js
import React from 'react';

const PaymentStatus = ({ paymentStatus }) => {
  return (
    <div>
      <h2>Payment Status</h2>
      <p>Status: {paymentStatus.status}</p>
      {paymentStatus.payment_id && <p>Payment ID: {paymentStatus.payment_id}</p>}
      {paymentStatus.txid && <p>Transaction ID: {paymentStatus.txid}</p>}
      {paymentStatus.error && <p>Error: {paymentStatus.error}</p>}
    </div>
  );
};

export default PaymentStatus;
