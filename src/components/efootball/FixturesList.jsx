import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
      const response = await api.get('/efootball/');
      setFixtures(response.data);
      console.log("efootball data", response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load efootball fixtures.');
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
      await api.delete(`/efootball/${id}/`);
      fetchFixtures();
    } catch (err) {
      console.error(err);
      alert('Failed to delete efootball fixture.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFixtures.length === 0) return alert('Select fixtures first.');
    if (!window.confirm(`Delete ${selectedFixtures.length} fixtures?`)) return;

    try {
      await api.delete('/football/bulk-delete/', { data: { ids: selectedFixtures } });
      setSelectedFixtures([]);
      setShowBulkActions(false);
      fetchFixtures();
    } catch (err) {
      console.error(err);
      alert('Failed to delete fixtures.');
    }
  };

  const toggleSelectFixture = (id) => {
    setSelectedFixtures((prev) =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFixtures.length === fixtures.length) setSelectedFixtures([]);
    else setSelectedFixtures(fixtures.map(f => f.id));
  };

  const getOddsClass = (hasFireIcon) =>
    `flex-1 p-3 rounded-lg text-center ${
      hasFireIcon
        ? 'bg-orange-50 border border-orange-200'
        : 'bg-gray-50'
    }`;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800"> Match eFootball</h2>
        <div className="flex gap-2">
          {fixtures.length > 0 && (
            <button onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2">
              Bulk Actions
            </button>
          )}
          <button onClick={() => navigate('/create-efootball')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
            Add efootball
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
              onChange={toggleSelectAll}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">{selectedFixtures.length} selected</span>
          </div>
          <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Delete Selected</button>
          <button onClick={() => setShowBulkActions(false)} className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">Cancel</button>
        </div>
      )}

      {/* Error */}
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

      {/* Fixtures Grid */}
      {fixtures.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No football available</p>
          <button onClick={() => navigate('/create-efootball')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create First Efootball</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fixtures.map(fixture => (
            <div key={fixture.id} className={`relative bg-white rounded-xl shadow-sm hover:shadow-md border-2 ${selectedFixtures.includes(fixture.id) ? 'border-purple-500' : 'border-transparent'}`}>
              
              {/* Selection */}
              {showBulkActions && <input type="checkbox" checked={selectedFixtures.includes(fixture.id)} onChange={() => toggleSelectFixture(fixture.id)}
                className="absolute m-2 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>}

              {/* Card Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{fixture.league.split('/').pop()}</span>
                  <span className="text-xs text-gray-400">ID: {fixture.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>{fixture.date}</span> • <span>{fixture.time}</span>
                </div>
                <div className="text-center mb-4">
                  <div className="font-bold text-lg">{fixture.homeTeam}</div>
                  <div className="text-sm my-1">vs</div>
                  <div className="font-bold text-lg">{fixture.awayTeam}</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className={getOddsClass(fixture.homeHasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Home</div>
                    <div className="font-bold">{fixture.homeOdds} {fixture.homeHasFireIcon && '🔥'}</div>
                  </div>
                  <div className={getOddsClass(fixture.drawHasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Draw</div>
                    <div className="font-bold">{fixture.drawOdds} {fixture.drawHasFireIcon && '🔥'}</div>
                  </div>
                  <div className={getOddsClass(fixture.awayHasFireIcon)}>
                    <div className="text-xs text-gray-500 mb-1">Away</div>
                    <div className="font-bold">{fixture.awayOdds} {fixture.awayHasFireIcon && '🔥'}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                <div className='flex justify-between items-center  gap-5'>
                  <span className="text-sm text-gray-600">🎲 {fixture.betCount} bets</span>
                  <span className="text-sm text-gray-600"> {fixture.market} +Market</span>
                  </div>
                  <div className="flex gap-1">
                    {fixture.hasBoostedOdds && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">⚡ Boosted</span>}
                    {fixture.hasTwoUp && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">2️⃣ 2UP</span>}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button onClick={() => navigate(`/edit-efootball/${fixture.id}`, { state: { fixture } })}
                    className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">Edit</button>
                  <button onClick={() => handleDelete(fixture.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Delete</button>
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