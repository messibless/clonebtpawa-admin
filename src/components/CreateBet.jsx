import React, { useState } from 'react';
import axios from 'axios';

const CreateBet = ({ API_URL, onBetCreated }) => {
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    stake: '',
    currency: 'TSh',
    bet_type: 'Accumulator',
    homeMatche1: '',
    awayMatche1: '',
    oddsMatche1: '',
    scoreMatche1: '',
    selectionMatche1: '',
    homeMatche2: '',
    awayMatche2: '',
    oddsMatche2: '',
    scoreMatche2: '',
    selectionMatche2: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTotalOdds = () => {
    const odds1 = parseFloat(formData.oddsMatche1) || 1;
    const odds2 = parseFloat(formData.oddsMatche2) || 1;
    return (odds1 * odds2).toFixed(2);
  };

  const calculatePayout = () => {
    const stake = parseFloat(formData.stake) || 0;
    return (stake * parseFloat(calculateTotalOdds())).toFixed(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        total_odds: calculateTotalOdds(),
        payout: calculatePayout()
      };

      await axios.post(`${API_URL}/bets`, payload);
      alert('Bet created successfully!');
      onBetCreated && onBetCreated();

      // Reset form
      setFormData({
        time: '',
        date: '',
        stake: '',
        currency: 'TSh',
        bet_type: 'Accumulator',
        homeMatche1: '',
        awayMatche1: '',
        oddsMatche1: '',
        scoreMatche1: '',
        selectionMatche1: '',
        homeMatche2: '',
        awayMatche2: '',
        oddsMatche2: '',
        scoreMatche2: '',
        selectionMatche2: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Create New Bet</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-4 md:p-6 space-y-6">
        
        {/* Time & Date - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="time"
            placeholder="Time (e.g. 2:30 PM)"
            value={formData.time}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="date"
            placeholder="Date (e.g. Monday 23/3)"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Stake, Currency, Bet Type - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            step="0.01"
            name="stake"
            placeholder="Stake"
            value={formData.stake}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="TSh">TSh</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            name="bet_type"
            value={formData.bet_type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Single">Single</option>
            <option value="Accumulator">Accumulator</option>
          </select>
        </div>

        {/* MATCH 1 */}
        <div className="border p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Match 1</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="homeMatche1" 
              placeholder="Home Team"
              value={formData.homeMatche1} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="awayMatche1" 
              placeholder="Away Team"
              value={formData.awayMatche1} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="number" 
              step="0.01" 
              name="oddsMatche1" 
              placeholder="Odds"
              value={formData.oddsMatche1} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="scoreMatche1" 
              placeholder="Score (e.g 0-0)"
              value={formData.scoreMatche1} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="selectionMatche1" 
              placeholder="Selection (e.g. Home Win)"
              value={formData.selectionMatche1} 
              onChange={handleChange}
              className="border p-2 rounded w-full md:col-span-2" 
              required 
            />
          </div>
        </div>

        {/* MATCH 2 */}
        <div className="border p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Match 2</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="homeMatche2" 
              placeholder="Home Team"
              value={formData.homeMatche2} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="awayMatche2" 
              placeholder="Away Team"
              value={formData.awayMatche2} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="number" 
              step="0.01" 
              name="oddsMatche2" 
              placeholder="Odds"
              value={formData.oddsMatche2} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="scoreMatche2" 
              placeholder="Score (e.g 0-0)"
              value={formData.scoreMatche2} 
              onChange={handleChange}
              className="border p-2 rounded w-full" 
              required 
            />

            <input 
              type="text" 
              name="selectionMatche2" 
              placeholder="Selection (e.g. Away Win)"
              value={formData.selectionMatche2} 
              onChange={handleChange}
              className="border p-2 rounded w-full md:col-span-2" 
              required 
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-medium">Total Odds:</span>
            <strong className="text-xl">{calculateTotalOdds()}</strong>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2">
            <span className="font-medium">Potential Payout:</span>
            <strong className="text-xl text-green-600">
              {calculatePayout()} {formData.currency}
            </strong>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Bet'}
        </button>

      </form>
    </div>
  );
};

export default CreateBet;