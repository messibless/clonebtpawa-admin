import React from 'react';

const Statistics = ({ bets }) => {
  // Calculate statistics
  const totalBets = bets.length;
  const totalStake = bets.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
  const wonBets = bets.filter(bet => bet.result === 'WON').length;
  const lostBets = bets.filter(bet => bet.result === 'LOST').length;
  const pendingBets = bets.filter(bet => bet.result === 'PENDING').length;
  
  const winRate = totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Bets',
      value: totalBets,
      icon: '🎲',
      color: 'bg-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Total Stake',
      value: `TSh ${totalStake.toFixed(2)}`,
      icon: '💰',
      color: 'bg-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: '📈',
      color: 'bg-purple-500',
      bg: 'bg-purple-50'
    },
    {
      title: 'Active Bets',
      value: pendingBets,
      icon: '⏳',
      color: 'bg-yellow-500',
      bg: 'bg-yellow-50'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bg} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bet Results</h3>
        <div className="flex items-center space-x-8">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-24 text-sm text-gray-600">Won</div>
              <div className="flex-1">
                <div className="h-4 bg-green-500 rounded-full" style={{ width: `${(wonBets / totalBets) * 100 || 0}%` }}></div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-green-600">{wonBets}</div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-24 text-sm text-gray-600">Lost</div>
              <div className="flex-1">
                <div className="h-4 bg-red-500 rounded-full" style={{ width: `${(lostBets / totalBets) * 100 || 0}%` }}></div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-red-600">{lostBets}</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Pending</div>
              <div className="flex-1">
                <div className="h-4 bg-yellow-500 rounded-full" style={{ width: `${(pendingBets / totalBets) * 100 || 0}%` }}></div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-yellow-600">{pendingBets}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;