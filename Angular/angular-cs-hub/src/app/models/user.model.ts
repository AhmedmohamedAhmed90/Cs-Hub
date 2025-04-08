export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  User = 'User'
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date | string;
  lastLoginAt?: Date | string;
}