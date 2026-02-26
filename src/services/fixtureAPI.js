// src/services/fixtureAPI.js
import api from './api';

export const fixtureAPI = {
  // Get all fixtures
  getAll: () => api.get('/fixtures/'),
  
  // Get single fixture
  getById: (id) => api.get(`/fixtures/${id}/`),
  
  // Create fixture
  create: (data) => api.post('/fixtures/', data),
  
  // Create multiple fixtures
  createBulk: (data) => api.post('/fixtures/bulk/', data),
  
  // Update fixture (full)
  update: (id, data) => api.put(`/fixtures/${id}/`, data),
  
  // Update fixture (partial)
  patch: (id, data) => api.patch(`/fixtures/${id}/`, data),
  
  // Update multiple fixtures
  updateBulk: (data) => api.put('/fixtures/bulk/update/', data),
  
  // Delete fixture
  delete: (id) => api.delete(`/fixtures/${id}/`),
  
  // Delete multiple fixtures
  deleteBulk: (ids) => api.delete('/fixtures/bulk/delete/', { data: { ids } }),
};