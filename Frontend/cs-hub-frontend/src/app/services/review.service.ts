import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) { }

  getReviewsByResource(resourceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_reviews_by_resource/${resourceId}`);
  }

  createReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_review`, reviewData);
  }

  updateReview(reviewId: number, newRating: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_review/${reviewId}`, { newrating: newRating });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_review/${reviewId}`);
  }
} 