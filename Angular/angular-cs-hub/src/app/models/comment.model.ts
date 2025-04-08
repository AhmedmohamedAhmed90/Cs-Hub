import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId: number;
  user?: User;
  resourceId: number;
  parentCommentId?: number;
  replies?: Comment[];
}