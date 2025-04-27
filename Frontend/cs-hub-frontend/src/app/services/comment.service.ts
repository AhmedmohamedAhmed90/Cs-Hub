import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) { }

  getCommentsByResource(resourceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_resource_comments/${resourceId}`);
  }

  createComment(commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_comment`, commentData);
  }

  updateComment(commentId: number, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_comment/${commentId}`, { content });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_comment/${commentId}`);
  }
} 