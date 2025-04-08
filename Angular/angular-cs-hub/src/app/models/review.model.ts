import { User } from './user.model';

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId: number;
  user?: User;
  resourceId: number;
}