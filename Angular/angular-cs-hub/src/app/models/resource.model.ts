import { Category } from './category.model';
import { User } from './user.model';
import { Comment } from './comment.model';
import { Review } from './review.model';

export enum ResourceType {
  Course = 'Course',
  Tutorial = 'Tutorial',
  Book = 'Book',
  Documentation = 'Documentation',
  Video = 'Video',
  Tool = 'Tool',
  Article = 'Article',
  Other = 'Other'
}

export enum DifficultyLevel {
  Beginner = 'Beginner', 
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  resourceType: ResourceType;
  url?: string;
  imageUrl?: string;
  difficultyLevel: DifficultyLevel;
  durationMinutes?: number;
  isFeatured: boolean;
  isPublished: boolean;
  publicationDate: Date | string;
  viewCount: number;
  rating: number;
  author?: User;
  authorId?: number;
  category?: Category;
  categoryId: number;
  comments?: Comment[];
  reviews?: Review[];
  tags?: string[];
}