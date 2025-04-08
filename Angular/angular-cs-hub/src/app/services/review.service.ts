import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Review } from '@models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) { }

  getReviewsByResourceId(resourceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/resource/${resourceId}`);
  }

  getUserReviewForResource(resourceId: number): Observable<Review | null> {
    return this.http.get<Review | null>(`${this.apiUrl}/resource/${resourceId}/user`);
  }

  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  updateReview(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}