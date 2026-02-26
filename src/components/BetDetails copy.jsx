import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BetDetails = ({ bet, onRefresh, onBack, onEdit }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    stake: bet.stake,
    currency: bet.currency,
  });
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // ... rest of your BetDetails code ...

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bet?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/bets/${bet.id}/`);
      onRefresh();
      navigate('/bets'); // Navigate back to bets list
    } catch (error) {
      console.error('Error deleting bet:', error);
      alert('Failed to delete bet');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component
};