import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('kids_world_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const api = {
  auth: {
    login: async (email, password) => {
      const { data } = await apiClient.post('/users/login', { email, password });
      return data;
    },
    signup: async (name, email, password) => {
      const { data } = await apiClient.post('/users/signup', { name, email, password });
      return data;
    }
  },
  products: {
    getAll: async (params) => {
      const { data } = await apiClient.get('/products');
      let filtered = data.map(p => ({
        ...p,
        id: p._id,
        gender: p.gender || 'Unisex', // Use backend field
        rating: 4.5,
        ageRange: p.ageRange || 'Unspecified'
      }));


      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params?.age && params.age !== 'All') {
        filtered = filtered.filter(p => p.ageRange === params.age);
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
        );
      }
      return filtered;
    },
    getById: async (id) => {
      const { data } = await apiClient.get(`/products/${id}`);
      return {
        ...data,
        id: data._id,
        gender: 'Unisex',
        rating: 4.5,
        ageRange: data.ageRange || 'Unspecified'
      };
    },
    getFeatured: async () => {
      const { data } = await apiClient.get('/products');
      return data.slice(0, 4);
    },
    create: async (productData) => {
      const { data } = await apiClient.post('/products', productData);
      return data;
    }
  },
  orders: {
    create: async (order) => {
      const { data } = await apiClient.post('/orders', order);
      return data;
    },
    getMyOrders: async () => {
      const { data } = await apiClient.get('/orders/myorders');
      return data;
    }
  },
  carts: {
    get: async () => {
      const { data } = await apiClient.get('/cart');
      return data;
    },
    update: async (cartItems) => {
      const { data } = await apiClient.put('/cart', cartItems);
      return data;
    }
  },
  users: {
    getAll: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    },
    delete: async (id) => {
      const { data } = await apiClient.delete(`/users/${id}`);
      return data;
    },
    create: async (userData) => {
      const { data } = await apiClient.post('/users', userData);
      return data;
    }
  },
  admin: {
    getAllOrders: async () => {
      const { data } = await apiClient.get('/orders');
      return data;
    },
    getUserOrders: async (userId) => {
      const { data } = await apiClient.get(`/orders/user/${userId}`);
      return data;
    },
    deleteProduct: async (id) => {
      const { data } = await apiClient.delete(`/products/${id}`);
      return data;
    },
    updateProduct: async (id, productData) => {
      const { data } = await apiClient.put(`/products/${id}`, productData);
      return data;
    }
  }
};
