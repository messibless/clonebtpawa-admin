import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BalanceManager = () => {
  const [balance, setBalance] = useState(null);
  const [formData, setFormData] = useState({
    amount: 0.00
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await api.get('/balance');
      console.log('✅ Balance fetched:', response.data);
      setBalance(response.data);
      setFormData({
        amount: response.data.amount,
        currency: response.data.currency
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/balance/', {
        amount: formData.amount
      });
      console.log('✅ Balance created:', response.data);
      setBalance(response.data.data);
      alert('Balance created successfully!');
    } catch (error) {
      console.error('Error creating balance:', error);
      setError(error.response?.data?.error || 'Failed to create balance');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.patch('/balance/', {
        amount: formData.amount,
        currency: formData.currency
      });
      console.log('✅ Balance updated:', response.data);
      setBalance(response.data.data);
      alert('Balance updated successfully!');
    } catch (error) {
      console.error('Error updating balance:', error);
      setError(error.response?.data?.error || 'Failed to update balance');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Balance</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {balance && !loading && (
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
          <p className="text-sm opacity-90 mb-1">Current Balance</p>
          <p className="text-4xl font-bold">
            {formatCurrency(balance.amount)}
          </p>
          <p className="text-xs opacity-75 mt-2">
            Last updated: 
          </p>
        </div>
      )}

      <form onSubmit={balance ? handleUpdate : handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Balance Amount
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount"
            required
          />
        </div>

       

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 font-medium"
        >
          {loading ? 'Processing...' : (balance ? 'Update Balance' : 'Create Balance')}
        </button>
      </form>

      {loading && (
        <div className="mt-4 text-center text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default BalanceManager;