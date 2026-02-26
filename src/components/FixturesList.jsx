import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FixturesList = () => {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFixtures, setSelectedFixtures] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const response = await api.get('/fixtures/');
      setFixtures(response.data);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError('Failed to load fixtures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fixture?')) return;
    
    try {
      await api.delete(`/fixtures/${id}/`);
      // Refresh list
      fetchFixtures();
    } catch (error) {
      console.error('Error deleting fixture:', error);
      alert('Failed to delete fixture');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFixtures.length === 0) {
      alert('Please select fixtures to delete');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedFixtures.length} fixtures?`)) return;
    
    try {
      await api.delete('/fixtures/bulk/delete/', { data: { ids: selectedFixtures } });
      setSelectedFixtures([]);
      setShowBulkActions(false);
      fetchFixtures();
    } catch (error) {
      console.error('Error deleting fixtures:', error);
      alert('Failed to delete fixtures');
    }
  };

  const handleSelectFixture = (id) => {
    if (selectedFixtures.includes(id)) {
      setSelectedFixtures(selectedFixtures.filter(fid => fid !== id));
    } else {
      setSelectedFixtures([...selectedFixtures, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFixtures.length === fixtures.length) {
      setSelectedFixtures([]);
    } else {
      setSelectedFixtures(fixtures.map(f => f.id));
    }
  };

  const getOddsClass = (odds, hasFireIcon) => {
    return `flex-1 p-3 rounded-lg text-center ${
      hasFireIcon 
        ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200' 
        : 'bg-gray-50'
    }`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Match Fixtures</h2>
        
        <div className="flex gap-2">
          {/* Bulk Actions */}
          {fixtures.length > 0 && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Bulk Actions
            </button>
          )}
          
          <button
            onClick={() => navigate('/create-fixture')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Fixture
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFixtures.length === fixtures.length && fixtures.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">
              {selectedFixtures.length} selected
            </span>
          </div>
          
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
          
          <button
            onClick={() => setShowBulkActions(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Fixtures Grid - Cards */}
      {fixtures.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No fixtures available</p>
          <button
            onClick={() => navigate('/create-fixture')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create First Fixture
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fixtures.map((fixture) => (
            <div
              key={fixture.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 ${
                selectedFixtures.includes(fixture.id) ? 'border-purple-500' : 'border-transparent'
              }`}
            >
              {/* Selection Checkbox (for bulk actions) */}
              {showBulkActions && (
                <div className="absolute m-2">
                  <input
                    type="checkbox"
                    checked={selectedFixtures.includes(fixture.id)}
                    onChange={() => handleSelectFixture(fixture.id)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="p-5">
                {/* League and Event ID */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {fixture.league.split('/').pop()}
                  </span>
                  <span className="text-xs text-gray-400">ID: {fixture.eventId}</span>
                </div>

                {/* Date and Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(fixture.date)}</span>
                  <span>•</span>
                  <span>{formatTime(fixture.time)}</span>
                </div>

                {/* Teams */}
                <div className="text-center mb-4">
                  <div className="font-bold text-lg text-gray-800">{fixture.homeTeam}</div>
                  <div className="text-sm text-gray-500 my-1">vs</div>
                  <div className="font-bold text-lg text-gray-800">{fixture.awayTeam}</div>
                </div>

                {/* Odds */}
                <div className="flex gap-2 mb-4">
                  {/* Home Odds */}
                  <div className={getOddsClass(fixture.homeOdds.value, fixture.homeOdds.hasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Home</div>
                    <div className="font-bold text-gray-800 flex items-center justify-center gap-1">
                      {fixture.homeOdds.value}
                      {fixture.homeOdds.hasFireIcon && (
                        <span className="text-orange-500">🔥</span>
                      )}
                    </div>
                  </div>

                  {/* Draw Odds */}
                  <div className={getOddsClass(fixture.drawOdds.value, fixture.drawOdds.hasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Draw</div>
                    <div className="font-bold text-gray-800 flex items-center justify-center gap-1">
                      {fixture.drawOdds.value}
                      {fixture.drawOdds.hasFireIcon && (
                        <span className="text-orange-500">🔥</span>
                      )}
                    </div>
                  </div>

                  {/* Away Odds */}
                  <div className={getOddsClass(fixture.awayOdds.value, fixture.awayOdds.hasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Away</div>
                    <div className="font-bold text-gray-800 flex items-center justify-center gap-1">
                      {fixture.awayOdds.value}
                      {fixture.awayOdds.hasFireIcon && (
                        <span className="text-orange-500">🔥</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats and Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      🎲 {fixture.betCount} bets
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {fixture.hasBoostedOdds && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        ⚡ Boosted
                      </span>
                    )}
                    {fixture.hasTwoUp && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        2️⃣ 2UP
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => navigate(`/edit-fixture/${fixture.id}`, { state: { fixture } })}
                    className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fixture.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>

                {/* Bet Count Detail */}
                <div className="mt-2 text-xs text-gray-400 text-center">
                  Event ID: {fixture.eventId} • {fixture.league}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixturesList;