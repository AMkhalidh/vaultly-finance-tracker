import axios from 'axios';
const api = axios.create({
  baseURL: 'https://vaultly-finance-tracker-production.up.railway.app',
});
export default api;
