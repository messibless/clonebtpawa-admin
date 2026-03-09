import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const EditBasketball = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fixture = location.state?.fixture;

  const [formData, setFormData] = useState({
    time: fixture?.time || '',
    date: fixture?.date || '',
    homeTeam: fixture?.homeTeam || '',
    awayTeam: fixture?.awayTeam || '',
    league: fixture?.league || '',
    homeOdds: fixture?.homeOdds || 1.00,
    homeHasFireIcon: fixture?.homeHasFireIcon || false,
    drawOdds: fixture?.drawOdds || 1.00,
    drawHasFireIcon: fixture?.drawHasFireIcon || false,
    awayOdds: fixture?.awayOdds || 1.00,
    awayHasFireIcon: fixture?.awayHasFireIcon || false,
    betCount: fixture?.betCount || 0,
    hasBoostedOdds: fixture?.hasBoostedOdds || false,
    hasTwoUp: fixture?.hasTwoUp || false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!fixture) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No fixture data found</p>
        <button
          onClick={() => navigate('/efootball')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Fixtures
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requiredFields = ['time','date','homeTeam','awayTeam','league','homeOdds','drawOdds','awayOdds'];
      for (let field of requiredFields) {
        if (!formData[field]) throw new Error(`Field "${field}" is required`);
      }

      const payload = {
        time: formData.time,
        date: formData.date,
        homeTeam: formData.homeTeam,
        awayTeam: formData.awayTeam,
        league: formData.league,
        homeOdds: parseFloat(formData.homeOdds),
        homeHasFireIcon: formData.homeHasFireIcon,
        drawOdds: parseFloat(formData.drawOdds),
        drawHasFireIcon: formData.drawHasFireIcon,
        awayOdds: parseFloat(formData.awayOdds),
        awayHasFireIcon: formData.awayHasFireIcon,
        betCount: parseInt(formData.betCount) || 0,
        hasBoostedOdds: formData.hasBoostedOdds,
        hasTwoUp: formData.hasTwoUp
      };

      console.log('📤 Sending updated basketball match data:', payload);
      const response = await api.patch(`/basketball/${fixture.id}/`, payload);
      console.log('✅ Match updated:', response.data);

      alert('basketball match updated successfully!');
      navigate('/basketball');

    } catch (err) {
      console.error('❌ Error updating match:', err);
      setError(err.response?.data?.message || err.message || 'Error updating match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit EFootball Match</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Time *</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="e.g., 18:30"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date *</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="e.g., 2026-03-05"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">League *</label>
            <input
              type="text"
              name="league"
              value={formData.league}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Home Team *</label>
            <input
              type="text"
              name="homeTeam"
              value={formData.homeTeam}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Away Team *</label>
            <input
              type="text"
              name="awayTeam"
              value={formData.awayTeam}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Odds */}
          <div>
            <label className="block mb-1 font-medium">Home Odds *</label>
            <input
              type="number"
              step="0.01"
              name="homeOdds"
              value={formData.homeOdds}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
            <label className="inline-flex items-center mt-1">
              <input
                type="checkbox"
                name="homeHasFireIcon"
                checked={formData.homeHasFireIcon}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-sm">🔥 Home Fire Icon</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Draw Odds *</label>
            <input
              type="number"
              step="0.01"
              name="drawOdds"
              value={formData.drawOdds}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
            <label className="inline-flex items-center mt-1">
              <input
                type="checkbox"
                name="drawHasFireIcon"
                checked={formData.drawHasFireIcon}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-sm">🔥 Draw Fire Icon</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Away Odds *</label>
            <input
              type="number"
              step="0.01"
              name="awayOdds"
              value={formData.awayOdds}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
            <label className="inline-flex items-center mt-1">
              <input
                type="checkbox"
                name="awayHasFireIcon"
                checked={formData.awayHasFireIcon}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-sm">🔥 Away Fire Icon</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Bet Count</label>
            <input
              type="number"
              name="betCount"
              value={formData.betCount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              name="hasBoostedOdds"
              checked={formData.hasBoostedOdds}
              onChange={handleInputChange}
            />
            <span className="text-sm">⚡ Has Boosted Odds</span>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              name="hasTwoUp"
              checked={formData.hasTwoUp}
              onChange={handleInputChange}
            />
            <span className="text-sm">2️⃣ Has Two Up</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium"
        >
          {loading ? 'Updating...' : 'Update basketball Match'}
        </button>
      </form>
    </div>
  );
};

export default EditBasketball;