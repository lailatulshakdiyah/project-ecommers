import axios from 'axios';
import { User, Customer, Package, Transaction } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await api.get(`/users?username=${username}&password=${password}`);
    if (response.data.length === 0) {
      throw new Error('Invalid credentials');
    }
    return response.data[0];
  },
};

// Customer API
export const customerAPI = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  update: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    // Get current customer data first
    const currentResponse = await api.get(`/customers/${id}`);
    const currentCustomer = currentResponse.data;
    
    // Merge with new data
    const updatedCustomer = {
      ...currentCustomer,
      ...customer,
      id: currentCustomer.id, // Ensure ID stays the same
    };
    
    // Use PUT method with complete data
    const response = await api.put(`/customers/${id}`, updatedCustomer);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

// Package API
export const packageAPI = {
  getAll: async (): Promise<Package[]> => {
    const response = await api.get('/packages');
    return response.data;
  },

  getById: async (id: number): Promise<Package> => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions?_expand=customer&_expand=package');
    return response.data;
  },

  getByCustomerId: async (customerId: number): Promise<Transaction[]> => {
    const response = await api.get(`/transactions?customerId=${customerId}&_expand=package`);
    return response.data;
  },

  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  updateStatus: async (id: number, status: Transaction['status']): Promise<Transaction> => {
    const response = await api.patch(`/transactions/${id}`, { status });
    return response.data;
  },
};

export default api;