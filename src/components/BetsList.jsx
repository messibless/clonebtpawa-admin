import React, { useState } from 'react';
import api from '../services/api';

const BetsList = ({ bets, onRefresh, onSelectBet, onEdit }) => {
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch(status) {
      case 'WAITING': return 'bg-yellow-100 text-yellow-800';
      case 'SETTLED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result) => {
    switch(result) {
      case 'WON': return 'text-green-600 font-semibold';
      case 'LOST': return 'text-red-600 font-semibold';
      default: return 'text-yellow-600';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bet?')) return;
    
    setProcessingId(id);
    try {
      // DELETE - BetDetailView inashughulikia hii (DELETE /bets/<id>/)
      await api.delete(`/bets/${id}/`);
      onRefresh();
    } catch (error) {
      console.error('Error deleting bet:', error);
      alert('Failed to delete bet');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (id, result) => {
    setProcessingId(id);
    try {
      // POST - BetApproveView inashughulikia hii
      await api.post(`/bets/${id}/approve/`, { result });
      onRefresh();
    } catch (error) {
      console.error('Error approving bet:', error);
      alert('Failed to approve bet');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBets = filter === 'all' 
    ? bets 
    : bets.filter(bet => bet.status === filter.toUpperCase());

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Bets</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('waiting')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'waiting' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('settled')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'settled' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Settled
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stake</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odds</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBets.map((bet) => (
              <tr key={bet.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{bet.id}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {bet.date} {bet.time}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {bet.stake} {bet.currency}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{bet.total_odds}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {bet.payout || '-'} {bet.currency}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bet.status)}`}>
                    {bet.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={getResultColor(bet.result)}>
                    {bet.result}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {/* View button */}
                    <button
                      onClick={() => onSelectBet(bet)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => onEdit(bet)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit Bet"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Approve button - only for WAITING bets */}
                    {bet.status === 'WAITING' && (
                      <>
                        <button
                          onClick={() => handleApprove(bet.id, 'WON')}
                          disabled={processingId === bet.id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          title="Approve as WON"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleApprove(bet.id, 'LOST')}
                          disabled={processingId === bet.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Approve as LOST"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(bet.id)}
                      disabled={processingId === bet.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Delete Bet"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bets found
          </div>
        )}
      </div>
    </div>
  );
};

export default BetsList;