import React, { useState, useEffect } from 'react';
import api from './services/api';
import Statistics from './components/Statistics';
import CreateBet from './components/CreateBet';
import BetsList from './components/BetsList';
import ActiveBets from './components/ActiveBets';
import SettledBets from './components/SettledBets';
import BetDetails from './components/BetDetails';

function App() {
  const [activeModule, setActiveModule] = useState('statistics');
  const [bets, setBets] = useState([]);
  const [selectedBet, setSelectedBet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_URL = 'http://127.0.0.1:8000/api';

  const fetchBets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bets/');
      setBets(response.data);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectBet = (bet) => {
    setSelectedBet(bet);
    setActiveModule('details');
  };

  const navigationLinks = [
    {
      id: 'statistics',
      label: 'Statistics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'blue'
    },
    {
      id: 'create',
      label: 'Create Bet',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      color: 'green'
    },
    {
      id: 'all-bets',
      label: 'All Bets',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
      color: 'purple'
    },
    {
      id: 'active-bets',
      label: 'Active Bets',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'yellow'
    },
    {
      id: 'settled-bets',
      label: 'Settled Bets',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'green'
    },
    {
      id: 'details',
      label: 'Bet Details',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'indigo'
    }
  ];

  const getNavItemClass = (moduleId) => {
    const baseClass = "w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ";
    if (activeModule === moduleId) {
      return baseClass + "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
    }
    return baseClass + "text-gray-600 hover:bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">BetAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveModule(link.id)}
              className={getNavItemClass(link.id)}
              disabled={link.id === 'details' && !selectedBet}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span>{link.label}</span>
              {link.id === 'active-bets' && (
                <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {bets.filter(b => b.status === 'WAITING').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
          <div className="text-xs text-gray-500">
            <div className="flex justify-between mb-1">
              <span>Total Bets:</span>
              <span className="font-medium">{bets.length}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Active:</span>
              <span className="font-medium text-yellow-600">
                {bets.filter(b => b.status === 'WAITING').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Settled:</span>
              <span className="font-medium text-green-600">
                {bets.filter(b => b.status === 'SETTLED').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && (
          <>
            {activeModule === 'statistics' && (
              <Statistics 
                bets={bets} 
                onRefresh={handleRefresh}
              />
            )}
            
            {activeModule === 'create' && (
              <CreateBet 
                API_URL={API_URL} 
                onBetCreated={handleRefresh}
              />
            )}
            
            {activeModule === 'all-bets' && (
              <BetsList 
                bets={bets}
                onRefresh={handleRefresh}
                onSelectBet={handleSelectBet}
              />
            )}
            
            {activeModule === 'active-bets' && (
              <ActiveBets 
                bets={bets.filter(b => b.status === 'WAITING')}
                onRefresh={handleRefresh}
                onSelectBet={handleSelectBet}
              />
            )}
            
            {activeModule === 'settled-bets' && (
              <SettledBets 
                bets={bets.filter(b => b.status === 'SETTLED')}
                onRefresh={handleRefresh}
                onSelectBet={handleSelectBet}
              />
            )}
            
            {activeModule === 'details' && selectedBet && (
              <BetDetails 
                bet={selectedBet}
                onRefresh={handleRefresh}
                onBack={() => setActiveModule('all-bets')}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;