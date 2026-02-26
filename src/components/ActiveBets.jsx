// ActiveBets.jsx
import React from 'react';
import BetsList from './BetsList';

const ActiveBets = ({ bets, onRefresh, onSelectBet, onEdit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Bets</h2>
      <BetsList 
        bets={bets} 
        onRefresh={onRefresh}
        onSelectBet={onSelectBet}
        onEdit={onEdit}
      />
    </div>
  );
};

export default ActiveBets;