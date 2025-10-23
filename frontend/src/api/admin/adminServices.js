import api from '../config';

// Admin Product Services
export const adminProductService = {
  getAll: (params) => api.get('/admin/products/', { params }),
  getById: (id) => api.get(`/admin/products/${id}/`),
  create: (data) => api.post('/admin/products/', data),
  update: (id, data) => api.put(`/admin/products/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/admin/products/${id}/`, data),
  delete: (id) => api.delete(`/admin/products/${id}/`),
  getStats: () => api.get('/admin/products/stats/'),
};

// Admin Category Services
export const adminCategoryService = {
  getAll: () => api.get('/admin/categories/'),
  getById: (id) => api.get(`/admin/categories/${id}/`),
  create: (data) => api.post('/admin/categories/', data),
  update: (id, data) => api.put(`/admin/categories/${id}/`, data),
  delete: (id) => api.delete(`/admin/categories/${id}/`),
};

// Admin Order Services
export const adminOrderService = {
  getAll: (params) => api.get('/admin/orders/', { params }),
  getById: (id) => api.get(`/admin/orders/${id}/`),
  updateStatus: (id, status) => api.patch(`/admin/orders/${id}/update_status/`, { status }),
  getStats: () => api.get('/admin/orders/stats/'),
};

// Admin User Services
export const adminUserService = {
  getAll: () => api.get('/admin/users/'),
  getById: (id) => api.get(`/admin/users/${id}/`),
  getStats: () => api.get('/admin/users/stats/'),
};