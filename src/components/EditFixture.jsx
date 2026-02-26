import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const EditFixture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fixture = location.state?.fixture;

  const [formData, setFormData] = useState({
    eventId: fixture?.eventId || '',
    time: fixture?.time || '',
    date: fixture?.date || '',
    homeTeam: fixture?.homeTeam || '',
    awayTeam: fixture?.awayTeam || '',
    league: fixture?.league || '',
    homeOdds: {
      value: fixture?.homeOdds?.value || 1.00,
      hasFireIcon: fixture?.homeOdds?.hasFireIcon || false
    },
    drawOdds: {
      value: fixture?.drawOdds?.value || 1.00,
      hasFireIcon: fixture?.drawOdds?.hasFireIcon || false
    },
    awayOdds: {
      value: fixture?.awayOdds?.value || 1.00,
      hasFireIcon: fixture?.awayOdds?.hasFireIcon || false
    },
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
      const response = await api.put(`/fixtures/${fixture.id}/`, formData);
      console.log('✅ Fixture updated:', response.data);
      alert('Fixture updated successfully!');
      navigate('/fixtures');
    } catch (error) {
      console.error('Error updating fixture:', error);
      setError(error.response?.data?.message || 'Failed to update fixture');
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Similar form fields as CreateFixture but with values pre-filled */}
        {/* ... (copy form fields from CreateFixture.jsx) ... */}
        
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