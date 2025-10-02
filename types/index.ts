export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'customer';
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  data: string;
  validity: string;
  category: 'basic' | 'standard' | 'premium' | 'unlimited';
}

export interface Transaction {
  id: number;
  customerId: number;
  packageId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'balance' | 'credit_card' | 'bank_transfer';
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}