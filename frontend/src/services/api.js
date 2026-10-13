const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://shopsimple-api-5q3a.onrender.com/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('shopsimple_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || 'Ocurrió un error en la solicitud.';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Autenticación
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/profile'),

  // Productos y Categorías
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Pedidos
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my-orders'),
  getAllOrders: () => request('/orders/admin/all'),
  updateOrderStatus: (id, statusData) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),

  // Pagos
  simulatePayment: (paymentData) => request('/payments/simulate', { method: 'POST', body: JSON.stringify(paymentData) })
};
