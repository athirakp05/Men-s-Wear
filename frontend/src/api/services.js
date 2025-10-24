import api from './config';

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
};

// Product Services
export const productService = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  getFeatured: () => api.get('/products/featured/'),
  getByCategory: (categoryId) => api.get('/products/', { params: { category: categoryId } }),
};

// Category Services
export const categoryService = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
};

// Cart Services
// Cart Services
export const cartService = {
  getCart: () => api.get('/cart/'),
  addItem: (data) => api.post('/cart/add_item/', data),
  updateItem: (data) => api.patch('/cart/update_item/', data),
  removeItem: (data) => api.delete('/cart/remove_item/', { data }),
  clearCart: () => api.delete('/cart/clear/'),
};

// Order Services
export const orderService = {
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
};