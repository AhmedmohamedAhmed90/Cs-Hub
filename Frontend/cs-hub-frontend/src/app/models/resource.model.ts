export interface Resource {
  resourceID: number;
  title: string;
  description: string;
  resourceType: string;
  url?: string;
  filePath?: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  category: {
    categoryID: number;
    name: string;
  };
  reviews?: Array<{
    reviewID: number;
    rating: number;
    createdAt: Date;
  }>;
  comments?: Array<{
    commentID: number;
    content: string;
    createdAt: Date;
  }>;
} 