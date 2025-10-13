import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8001/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// attach Bearer token automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('umkm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  // Auth
  login: (payload) => client.post('/umkm/login', payload),
  register: (payload) => client.post('/umkm/register', payload),
  logout: () => client.post('/umkm/logout'),

  // Accounts (read only)
  getAccounts: () => client.get('/accounts').then(r => r.data),

  // Transactions
  getTransactions: (params) => client.get('/transactions', { params }).then(r => r.data),
  getTransaction: (id) => client.get(`/transactions/${id}`).then(r => r.data),
  createTransaction: (payload) => client.post('/transactions', payload).then(r => r.data),
  deleteTransaction: (id) => client.delete(`/transactions/${id}`).then(r => r.data),

  // Reports
  getSummary: (params) => client.get('/reports/summary', { params }).then(r => r.data),

  getIncomeStatement: (params) => client.get('/reports/income-statement', { params }).then(r => r.data),
  getBalanceSheet: (params) => client.get('/reports/balance-sheet', { params }).then(r => r.data),
  getCashFlow: (params) => client.get('/reports/cash-flow', { params }).then(r => r.data),
  getRetainedEarnings: (params) => client.get('/reports/retained-earnings', { params }).then(r => r.data),
  downloadReportExcel: (month) =>
  client.get(`/reports/download-excel?month=${month}`, { responseType: "blob" }),

};

