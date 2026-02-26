import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BetDetails = ({ bet, onRefresh, onBack, onEdit }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    stake: bet.stake,
    currency: bet.currency,
  });
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [approveError, setApproveError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put(`/bets/${bet.id}/`, formData);
      console.log('✅ UPDATE RESPONSE:', response.data);
      setIsEditing(false);
      onRefresh();
      alert('Bet updated successfully!');
    } catch (error) {
      console.error('Error updating bet:', error);
      alert('Failed to update bet');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (result) => {
    setLoading(true);
    setApproveError('');
    
    try {
      console.log(`📤 Sending approve request for bet ${bet.id} with result: ${result}`);
      
      const response = await api.post(`/bets/${bet.id}/approve/`, { result });
      
      console.log('✅ APPROVE RESPONSE:', response.data);
      
      // Show success message
      alert(`Bet approved as ${result}!`);
      
      // Refresh the data
      onRefresh();
      
      // Navigate back to bets list after successful approval
      navigate('/bets');
      
    } catch (error) {
      console.error('❌ Error approving bet:', error);
      
      let errorMessage = 'Failed to approve bet';
      
      if (error.response) {
        // Server responded with error
        console.log('Error response data:', error.response.data);
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      JSON.stringify(error.response.data) || 
                      errorMessage;
        
        setApproveError(errorMessage);
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bet?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/bets/${bet.id}/`);
      onRefresh();
      navigate('/bets');
      alert('Bet deleted successfully!');
    } catch (error) {
      console.error('Error deleting bet:', error);
      alert('Failed to delete bet');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      {/* Header with Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left side - Back button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
              Bet Details - {bet.id}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              {bet.date} at {bet.time}
            </p>
          </div>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs md:text-sm whitespace-nowrap"
          >
            {showRawData ? 'Hide Raw Data' : 'View Raw Data'}
          </button>
          <button
            onClick={() => onEdit(bet)}
            className="px-3 md:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs md:text-sm whitespace-nowrap"
          >
            Edit Bet
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 text-xs md:text-sm whitespace-nowrap"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Raw JSON Data Display */}
      {showRawData && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Raw Response from Server:</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(bet, null, 2));
                alert('Copied to clipboard!');
              }}
              className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
          <pre className="text-xs text-green-400 overflow-auto max-h-96 p-2 bg-gray-900 rounded">
            {JSON.stringify(bet, null, 2)}
          </pre>
        </div>
      )}

      {/* Approve Error Display */}
      {approveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{approveError}</p>
        </div>
      )}

      {/* Summary Cards - Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Stake</p>
          <p className="text-xl lg:text-2xl font-bold text-blue-800 break-words">
            {formatCurrency(parseFloat(bet.stake), bet.currency)}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Odds</p>
          <p className="text-xl lg:text-2xl font-bold text-green-800">{bet.odds}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Total Odds</p>
          <p className="text-xl lg:text-2xl font-bold text-purple-800">
            {bet.details?.totalOdds || bet.odds}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Payout</p>
          <p className="text-xl lg:text-2xl font-bold text-yellow-800 break-words">
            {bet.payout ? formatCurrency(bet.payout, bet.currency) : 'Pending'}
          </p>
        </div>
      </div>

      {/* Status and Result - Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">Status</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              bet.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 
              bet.status === 'SETTLED' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {bet.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              bet.result === 'WON' ? 'bg-green-100 text-green-800' : 
              bet.result === 'LOST' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {bet.result}
            </span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">Bet Type</p>
          <p className="text-lg font-semibold">{bet.details?.betType || 'N/A'}</p>
        </div>
      </div>

      {/* Matches Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Matches ({bet.details?.matches?.length || 0})</h3>
        <div className="space-y-4">
          {bet.details?.matches?.map((match, index) => (
            <div key={index} className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 break-words">{match.teams}</p>
                  <p className="text-sm text-gray-500">Match ID: {match.id}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Odds: {match.odds}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded break-words">
                  <span className="text-gray-500">Market:</span>
                  <span className="ml-2 font-medium">{match.market}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded break-words">
                  <span className="text-gray-500">Selection:</span>
                  <span className="ml-2 font-medium">{match.selection}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details - Grid responsive */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Game ID</p>
            <p className="text-sm font-mono truncate">{bet.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm">{bet.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm">{bet.time}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Currency</p>
            <p className="text-sm">{bet.currency}</p>
          </div>
        </div>
      </div>

      {/* Approve Buttons - Only for WAITING bets */}
      {bet.status === 'OPEN' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleApprove('WON')}
            disabled={loading}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 font-medium px-4 transition-colors"
          >
            {loading ? 'Processing...' : '✅ Approve as WON'}
          </button>
          <button
            onClick={() => handleApprove('LOST')}
            disabled={loading}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 font-medium px-4 transition-colors"
          >
            {loading ? 'Processing...' : '❌ Approve as LOST'}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 text-center text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Processing request...</p>
        </div>
      )}
    </div>
  );
};

export default BetDetails;