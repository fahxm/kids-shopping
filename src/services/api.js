import { MOCK_PRODUCTS } from '../constants.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  products: {
    getAll: async (params) => {
      await delay(400);
      let filtered = [...MOCK_PRODUCTS];
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
      await delay(300);
      return MOCK_PRODUCTS.find(p => p.id === id) || null;
    },
    getFeatured: async () => {
      await delay(300);
      return MOCK_PRODUCTS.slice(0, 4);
    }
  },
  orders: {
    create: async (order) => {
      await delay(1000);
      return { success: true, order };
    }
  }
};
