import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to create FormData upload request
const createFormDataRequest = (method, url, formData, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type - browser will set it with boundary
  }
  return axios({ method, url: `${API_BASE_URL}${url}`, data: formData, headers })
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (formData) => {
    const token = localStorage.getItem('token')
    return createFormDataRequest('post', '/products', formData, token)
  },
  updateProduct: (id, data) => {
    if (data instanceof FormData) {
      const token = localStorage.getItem('token')
      return createFormDataRequest('put', `/products/${id}`, data, token)
    }
    return api.put(`/products/${id}`, data)
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getMyProducts: (params) => api.get('/products/seller/my-products', { params }),
  markAsSold: (id) => api.put(`/products/${id}/mark-sold`),
}

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getMyProducts: (params) => api.get('/users/my-products', { params }),
  getSellerProfile: (id) => api.get(`/users/seller/${id}`),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/admin/products', { params }),
  approveProduct: (id) => api.put(`/admin/products/${id}/approve`),
  rejectProduct: (id, reason) => api.put(`/admin/products/${id}/reject`, { reason }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`)
}

// Payments API removed - using direct buyer-seller contact instead

export default api
