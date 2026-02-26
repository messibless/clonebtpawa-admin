import React, { useState } from 'react';
import axios from 'axios';

const CreateBet = ({ API_URL, onBetCreated }) => {
  const [formData, setFormData] = useState({
    stake: 1.00,
    currency: 'TSh',
    matches: [
      {
        id: 'M001',
        teams: '',
        market: '1X2',
        selection: '',
        odds: 1.00
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const response = await axios.post(`${API_URL}/bets/`, formData);
      onBetCreated();
      // Reset form
      setFormData({
        stake: 1.00,
        currency: 'TSh',
        matches: [
          {
            id: 'M001',
            teams: '',
            market: '1X2',
            selection: '',
            odds: 1.00
          }
        ]
      });
      alert('Bet created successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Bet</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {/* Stake and Currency */}
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Matches</h3>
            <button
              type="button"
              onClick={addMatch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Match
            </button>
          </div>

          {formData.matches.map((match, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
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

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Odds:</span>
            <span className="text-xl font-bold text-blue-600">{calculateTotalOdds()}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Potential Payout:</span>
            <span className="text-xl font-bold text-green-600">
              {(formData.stake * parseFloat(calculateTotalOdds())).toFixed(2)} {formData.currency}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 font-medium"
        >
          {loading ? 'Creating...' : 'Create Bet'}
        </button>
      </form>
    </div>
  );
};

export default CreateBet;