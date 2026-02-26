import React, { useState, useEffect } from 'react';
import api from './services/api';  // Import api instance
import Statistics from './components/Statistics';
import CreateBet from './components/CreateBet';
import RecentBets from './components/RecentBets';

function App() {
  const [activeModule, setActiveModule] = useState('statistics');
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api';

  const fetchBets = async () => {
    try {
      // Tumia api instance badala ya axios direct
      const response = await api.get('/bets/');
      setBets(response.data);
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - haibadiliki */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">BetAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveModule('statistics')}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
              activeModule === 'statistics' 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Statistics</span>
          </button>

          <button
            onClick={() => setActiveModule('create')}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
              activeModule === 'create' 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Bet</span>
          </button>

          <button
            onClick={() => setActiveModule('recent')}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
              activeModule === 'recent' 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recent Bets</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeModule === 'statistics' && <Statistics bets={bets} />}
        {activeModule === 'create' && <CreateBet API_URL={API_URL} onBetCreated={fetchBets} />}
        {activeModule === 'recent' && <RecentBets bets={bets} />}
      </div>
    </div>
  );
}

export default App;