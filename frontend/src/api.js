import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const checkout = async (items) => {
  const { data } = await api.post('/checkout', { items });
  return data;
};

export default api;
