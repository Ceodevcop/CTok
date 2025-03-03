// src/services/api.js
const API_BASE_URL = 'http://localhost:3000';

const api = {
  createPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  submitPayment: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_id: paymentId }),
    });
    return response.json();
  },

  completePayment: async (paymentId, txid) => {
    const response = await fetch(`${API_BASE_URL}/payments/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_id: paymentId, txid }),
    });
    return response.json();
  },
};

export default api;
