import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import api from './services/api';
import Statistics from './components/Statistics';
import CreateBet from './components/CreateBet';
import EditBet from './components/EditBet';
import BetsList from './components/BetsList';
import ActiveBets from './components/ActiveBets';
import SettledBets from './components/SettledBets';
import BetDetails from './components/BetDetails';
import FixturesList from './components/FixturesList';
import CreateFixture from './components/CreateFixture';
import EditFixture from './components/EditFixture';
import BalanceManager from './components/BalanceManager'; // 🔥 Import BalanceManager

// Wrap the main App content with router hooks
function AppContent() {
  const [bets, setBets] = useState([]);
  const [selectedBet, setSelectedBet] = useState(null);
  const [editingBet, setEditingBet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
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
    setEditingBet(null);
    navigate(`/bet/${bet.id}`);
    setSidebarOpen(false);
  };

  const handleEdit = (bet) => {
    setEditingBet(bet);
    setSelectedBet(null);
    navigate(`/edit/${bet.id}`);
    setSidebarOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingBet(null);
    navigate('/bets');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const navigationLinks = [
    {
      path: '/',
      label: 'Statistics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      path: '/create',
      label: 'Create Bet',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    },
    {
      path: '/fixtures',
      label: 'Match Fixtures',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/bets',
      label: 'All Bets',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    },
    {
      path: '/active',
      label: 'Active Bets',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/settled',
      label: 'Settled Bets',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    // 🔥 Add Balance link
    {
      path: '/balance',
      label: 'Account Balance',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15h-3v-2h3v2zm0-4h-3V7h3v6z',
    }
  ];

  const getNavItemClass = (path) => {
    const baseClass = "w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ";
    if (location.pathname === path) {
      return baseClass + "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
    }
    if (path === '/bet/' && location.pathname.startsWith('/bet/')) {
      return baseClass + "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
    }
    if (path === '/edit/' && location.pathname.startsWith('/edit/')) {
      return baseClass + "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
    }
    return baseClass + "text-gray-600 hover:bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-30 p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-xl font-bold text-blue-600">BetAdmin</h1>
        <div className="w-8"></div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-transparent z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 w-64 h-full bg-white shadow-lg overflow-y-auto z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">BetAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {navigationLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={getNavItemClass(link.path)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span>{link.label}</span>
              {link.path === '/active' && (
                <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {bets.filter(b => b.status === 'OPEN').length}
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
                {bets.filter(b => b.status === 'OPEN').length}
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
      <div className={`
        transition-all duration-300 ease-in-out
        lg:ml-64
        ${sidebarOpen ? 'lg:ml-64' : ''}
        pt-16 lg:pt-0
      `}>
        <div className="p-4 lg:p-8">
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && (
            <Routes>
              <Route path="/admin-panel/" element={<Statistics bets={bets} onRefresh={handleRefresh} />} />
              
              <Route path="/create" element={
                <CreateBet API_URL={API_URL} onBetCreated={handleRefresh} />
              } />
              <Route path="/create-fixture" element={<CreateFixture />} />
              <Route path="/fixtures" element={<FixturesList />} />
              <Route path="/edit-fixture/:id" element={<EditFixture />} />
              
              <Route path="/edit/:id" element={
                <EditBet 
                  bet={editingBet}
                  onBetUpdated={handleRefresh}
                  onCancel={handleCancelEdit}
                />
              } />
              
              <Route path="/bets" element={
                <BetsList 
                  bets={bets}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="/active" element={
                <ActiveBets 
                  bets={bets.filter(b => b.status === 'OPEN')}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="/settled" element={
                <SettledBets 
                  bets={bets.filter(b => b.status === 'SETTLED')}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="/bet/:id" element={
                <BetDetails 
                  bet={selectedBet}
                  onRefresh={handleRefresh}
                  onBack={() => navigate('/bets')}
                  onEdit={handleEdit}
                />
              } />

              {/* 🔥 Add Balance route */}
              <Route path="/balance" element={
                <BalanceManager />
              } />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;