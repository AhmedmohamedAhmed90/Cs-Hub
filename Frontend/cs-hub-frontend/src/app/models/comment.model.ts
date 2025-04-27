export interface Comment {
  CommentID: number;
  ResourceID: number;
  UserID: number;
  Content: string;
  CreatedAt: string;
  User: {
    Id: number;
    FullName: string;
    Email: string;
  };
}

export interface CreateCommentDto {
  UserID: number;
  ResourceID: number;
  Content: string;
} 