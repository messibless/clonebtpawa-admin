import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import api from './services/api';
import Statistics from './components/Statistics';
import CreateBet from './components/CreateBet';
import EditBet from './components/EditBet';
import BetsList from './components/BetsList';
import ActiveBets from './components/ActiveBets';
import SettledBets from './components/SettledBets';
import BetDetails from './components/BetDetails';
// football fixture
import FixturesList from './components/FixturesList';
import CreateFixture from './components/CreateFixture';
import EditFixture from './components/EditFixture';
// Efootball fixture
import EfootballList from './components/efootball/FixturesList';
import CreateEfootball from './components/efootball/CreateEfootball';
import EditEfootball from './components/efootball/EditEfootball';
import BalanceManager from './components/BalanceManager';
// Basketball fixture
import TennisList from './components/tennis/TennisList';
import TennisCreate from './components/tennis/TennisCreate';
import EditTennis from './components/tennis/EditTennis';

// tennis fixture
import BasketballList from './components/basketball/BasketballList';
import BasketballCreate from './components/basketball/BasketballCreate';
import EditBasketball from './components/basketball/EditBasketball';


// live fixture
import LivesList from './components/lives/LivesList';
import LiveCreate from './components/lives/LiveCreate';
import EditLive from './components/lives/EditLive';


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
  const API_URL = 'http://localhost:5000/api';
  // const API_URL = 'https://betpaw.co.tz/node-api/api';

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
      label: 'Football Match',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/efootball',
      label: 'eFootball Match',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/live',
      label: 'Live Match',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/basketball',
      label: 'Basketball Match',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/tennis',
      label: 'Tennis Match',
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed with proper scrolling */}
      <div className={`
        fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50
        flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 flex justify-end border-b">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header - Fixed at top */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">BetAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>
        
        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto overscroll-contain py-4">
          {navigationLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={getNavItemClass(link.path)}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span className="flex-1 text-left truncate">{link.label}</span>
              {link.path === '/active' && (
                <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  {bets.filter(b => b.status === 'OPEN').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats in Sidebar - Fixed at bottom */}
        <div className="p-4 bg-gray-50 border-t mt-auto">
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
        min-h-screen
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
              <Route path="/" element={<Statistics bets={bets} onRefresh={handleRefresh} />} />
              
              <Route path="create" element={
                <CreateBet API_URL={API_URL} onBetCreated={handleRefresh} />
              } />
              <Route path="create-fixture" element={<CreateFixture />} />
              <Route path="fixtures" element={<FixturesList />} />
              <Route path="edit-fixture/:id" element={<EditFixture />} />

              {/* efootball */}
              <Route path="create-efootball" element={< CreateEfootball />} />
              <Route path="efootball" element={<EfootballList />} />
              <Route path="edit-efootball/:id" element={<EditEfootball />} />
              
              
              {/* basketball */}
              <Route path="create-basketball" element={< BasketballCreate />} />
              <Route path="basketball" element={<BasketballList />} />
              <Route path="edit-basketball/:id" element={<EditBasketball />} />
              
              
              {/* tennis */}
              <Route path="create-tennis" element={< TennisCreate />} />
              <Route path="tennis" element={<TennisList />} />
              <Route path="edit-tennis/:id" element={<EditTennis />} />
              
               {/* live */}
               <Route path="create-live" element={< LiveCreate />} />
              <Route path="live" element={<LivesList />} />
              <Route path="edit-live/:id" element={<EditLive />} />
              

              <Route path="edit/:id" element={
                <EditBet 
                  bet={editingBet}
                  onBetUpdated={handleRefresh}
                  onCancel={handleCancelEdit}
                />
              } />
              
              <Route path="bets" element={
                <BetsList 
                  bets={bets}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="active" element={
                <ActiveBets 
                  bets={bets.filter(b => b.status === 'OPEN')}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="settled" element={
                <SettledBets 
                  bets={bets.filter(b => b.status === 'SETTLED')}
                  onRefresh={handleRefresh}
                  onSelectBet={handleSelectBet}
                  onEdit={handleEdit}
                />
              } />
              
              <Route path="bet/:id" element={
                <BetDetails 
                  bet={selectedBet}
                  onRefresh={handleRefresh}
                  onBack={() => navigate('/bets')}
                  onEdit={handleEdit}
                />
              } />

              <Route path="balance" element={
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
    <BrowserRouter basename="/admin-panel/">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;