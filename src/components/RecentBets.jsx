import React from 'react';

const RecentBets = ({ bets }) => {
  const getResultColor = (result) => {
    switch(result) {
      case 'WON': return 'text-green-600 bg-green-100';
      case 'LOST': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Bets</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bets.map((bet) => (
                <tr key={bet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{bet.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {bet.date} {bet.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {bet.details?.matches?.length || 0} matches
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {bet.stake} {bet.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bet.odds}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getResultColor(bet.result)}`}>
                      {bet.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {bet.payout || '-'} {bet.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentBets;