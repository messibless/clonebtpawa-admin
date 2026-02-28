import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const EditFixture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fixture = location.state?.fixture;


  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    eventId: fixture?.eventId || '',
    date: fixture?.date || '',
    time: fixture?.time || '',
    homeTeam: fixture?.homeTeam || '',
    awayTeam: fixture?.awayTeam || '',
    league: fixture?.league || '',
    homeOdds: { value: fixture?.homeOdds?.value || 1.00, hasFireIcon: fixture?.homeOdds?.hasFireIcon || false },
    drawOdds: { value: fixture?.drawOdds?.value || 1.00, hasFireIcon: fixture?.drawOdds?.hasFireIcon || false },
    awayOdds: { value: fixture?.awayOdds?.value || 1.00, hasFireIcon: fixture?.awayOdds?.hasFireIcon || false },
    betCount: fixture?.betCount || 0,
    hasBoostedOdds: fixture?.hasBoostedOdds || false,
    hasTwoUp: fixture?.hasTwoUp || false
  });




  const handleOddsChange = (field, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: key === 'value' ? parseFloat(value) : value
      }
    }));
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!fixture) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No fixture data found</p>
        <button
          onClick={() => navigate('/fixtures')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Fixtures
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // Flatten nested odds objects to match serializer
      const payload = {
        ...formData,
        homeOdds: parseFloat(formData.homeOdds.value),
        drawOdds: parseFloat(formData.drawOdds.value),
        awayOdds: parseFloat(formData.awayOdds.value),
        homeFire: formData.homeOdds.hasFireIcon,
        drawFire: formData.drawOdds.hasFireIcon,
        awayFire: formData.awayOdds.hasFireIcon
      };
  
      const response = await api.put(`/fixtures/${fixture.id}/`, payload);
      console.log('✅ Fixture updated:', response.data);
      alert('Fixture updated successfully!');
      navigate('/fixtures');
    } catch (error) {
      console.error('Error updating fixture:', error);
      setError(error.response?.data || 'Failed to update fixture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Fixture</h2>
        <button
          onClick={() => navigate('/fixtures')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event ID *
              </label>
              <input
                type="number"
                name="eventId"
                value={formData.eventId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 31838944"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                League *
              </label>
              <input
                type="text"
                name="league"
                value={formData.league}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Football / England / Premier League"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Team *
              </label>
              <input
                type="text"
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Manchester United"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Away Team *
              </label>
              <input
                type="text"
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Chelsea FC"
                required
              />
            </div>
          </div>
        </div>

        {/* Odds Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Odds</h3>
          
          {/* Home Odds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Odds *
              </label>
              <input
                type="number"
                step="0.01"
                min="1.00"
                value={formData.homeOdds.value}
                onChange={(e) => handleOddsChange('homeOdds', 'value', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Draw Odds *
              </label>
              <input
                type="number"
                step="0.01"
                min="1.00"
                value={formData.drawOdds.value}
                onChange={(e) => handleOddsChange('drawOdds', 'value', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Away Odds *
              </label>
              <input
                type="number"
                step="0.01"
                min="1.00"
                value={formData.awayOdds.value}
                onChange={(e) => handleOddsChange('awayOdds', 'value', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Fire Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="homeFire"
                checked={formData.homeOdds.hasFireIcon}
                onChange={(e) => handleOddsChange('homeOdds', 'hasFireIcon', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="homeFire" className="text-sm text-gray-700">
                🔥 Home Odds Fire Icon
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="drawFire"
                checked={formData.drawOdds.hasFireIcon}
                onChange={(e) => handleOddsChange('drawOdds', 'hasFireIcon', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="drawFire" className="text-sm text-gray-700">
                🔥 Draw Odds Fire Icon
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="awayFire"
                checked={formData.awayOdds.hasFireIcon}
                onChange={(e) => handleOddsChange('awayOdds', 'hasFireIcon', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="awayFire" className="text-sm text-gray-700">
                🔥 Away Odds Fire Icon
              </label>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bet Count
              </label>
              <input
                type="number"
                name="betCount"
                value={formData.betCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="boostedOdds"
                name="hasBoostedOdds"
                checked={formData.hasBoostedOdds}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="boostedOdds" className="text-sm text-gray-700">
                ⚡ Has Boosted Odds
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="twoUp"
                name="hasTwoUp"
                checked={formData.hasTwoUp}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="twoUp" className="text-sm text-gray-700">
                2️⃣ Has Two Up
              </label>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Preview</h3>
          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-40">
            {JSON.stringify({
              eventId: parseInt(formData.eventId) || 0,
              time: formData.time,
              date: formData.date,
              homeTeam: formData.homeTeam || 'Home Team',
              awayTeam: formData.awayTeam || 'Away Team',
              league: formData.league || 'League',
              homeOdds: {
                value: parseFloat(formData.homeOdds.value) || 1.00,
                hasFireIcon: formData.homeOdds.hasFireIcon
              },
              drawOdds: {
                value: parseFloat(formData.drawOdds.value) || 1.00,
                hasFireIcon: formData.drawOdds.hasFireIcon
              },
              awayOdds: {
                value: parseFloat(formData.awayOdds.value) || 1.00,
                hasFireIcon: formData.awayOdds.hasFireIcon
              },
              betCount: parseInt(formData.betCount) || 0,
              hasBoostedOdds: formData.hasBoostedOdds,
              hasTwoUp: formData.hasTwoUp
            }, null, 2)}
          </pre>
        </div>

     



        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Updating...' : 'Update Fixture'}
        </button>
      </form>
    </div>
  );
};

export default EditFixture;