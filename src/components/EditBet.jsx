import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditBet = ({ bet, onBetUpdated, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    stake: bet.stake,
    currency: bet.currency,
    matches: bet.details?.matches || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when bet changes
  useEffect(() => {
    setFormData({
      stake: bet.stake,
      currency: bet.currency,
      matches: bet.details?.matches || []
    });
  }, [bet]);

  const handleMatchChange = (index, field, value) => {
    const newMatches = [...formData.matches];
    newMatches[index][field] = value;
    setFormData({ ...formData, matches: newMatches });
  };

  const addMatch = () => {
    const newId = `M${String(formData.matches.length + 1).padStart(3, '0')}`;
    setFormData({
      ...formData,
      matches: [
        ...formData.matches,
        {
          id: newId,
          teams: '',
          market: '1X2',
          selection: '',
          odds: 1.00
        }
      ]
    });
  };

  const removeMatch = (index) => {
    if (formData.matches.length > 1) {
      const newMatches = formData.matches.filter((_, i) => i !== index);
      setFormData({ ...formData, matches: newMatches });
    }
  };

  const calculateTotalOdds = () => {
    return formData.matches
      .reduce((total, match) => total * parseFloat(match.odds || 1), 1)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    // Convert id -> match_ref
    const payload = {
      ...formData,
      matches: formData.matches.map(m => ({
        match_ref: m.id,  // 🔥 Hapa lazima 'match_ref'
        teams: m.teams,
        market: m.market,
        selection: m.selection,
        odds: m.odds
      }))
    };
  
    try {
      const response = await api.put(`/bets/${bet.id}/`, payload);
      console.log('✅ Bet updated:', response.data);
      if (onBetUpdated) onBetUpdated();
      navigate('/bets');
      alert('Bet updated successfully!');
    } catch (error) {
      console.error('❌ Error updating bet:', error);
      if (error.response) setError(JSON.stringify(error.response.data) || 'Error updating bet');
      else setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
          Edit Bet - {bet.id}
        </h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 whitespace-nowrap"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Stake and Currency - Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stake Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.stake}
              onChange={(e) => setFormData({ ...formData, stake: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TSh">TSh (Tanzanian Shilling)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Matches Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Matches</h3>
            <button
              type="button"
              onClick={addMatch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              + Add Match
            </button>
          </div>

          <div className="space-y-4">
            {formData.matches.map((match, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <span className="font-medium text-gray-700">Match {match.id}</span>
                  {formData.matches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMatch(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Teams (e.g., Man United vs Arsenal)"
                    value={match.teams}
                    onChange={(e) => handleMatchChange(index, 'teams', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={match.market}
                    onChange={(e) => handleMatchChange(index, 'market', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1X2">1X2 (Match Result)</option>
                    <option value="Over/Under">Over/Under</option>
                    <option value="Both Teams to Score">Both Teams to Score</option>
                    <option value="Correct Score">Correct Score</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Selection (e.g., Man United)"
                    value={match.selection}
                    onChange={(e) => handleMatchChange(index, 'selection', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Odds"
                    value={match.odds}
                    onChange={(e) => handleMatchChange(index, 'odds', parseFloat(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary - Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Total Odds:</p>
            <p className="text-xl font-bold text-blue-600">{calculateTotalOdds()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Potential Payout:</p>
            <p className="text-xl font-bold text-green-600 break-words">
              {(formData.stake * parseFloat(calculateTotalOdds())).toFixed(2)} {formData.currency}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 font-medium"
        >
          {loading ? 'Updating...' : 'Update Bet'}
        </button>
      </form>
    </div>
  );
};

export default EditBet;