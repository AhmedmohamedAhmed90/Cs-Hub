import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/api/resources`;

  constructor(private http: HttpClient) {}

  getAllResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_all_resources`);
  }

  uploadResource(resourceData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, resourceData);
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_resource/${id}`);
  }

  getResourceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_resource/${id}`);
  }

  updateResource(id: number, resourceData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_resource/${id}`, resourceData);
  }

  getResourcesByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/resources`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/category/all-categories`);
  }

  searchResources(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }
} 
