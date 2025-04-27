export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  age: number;
  address: string;
  token?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  fullName: string;
  email: string;
  password: string;
  age: number;
  address: string;
} 
