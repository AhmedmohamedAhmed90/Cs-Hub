import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  // Authentication
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // User Management
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  toggleAdminRole(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/toggle-admin`, {});
  }

  // Category Management
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, categoryData);
  }

  updateCategory(categoryId: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${categoryId}`, categoryData);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}`);
  }

  // Resource Management
  getResources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resources`);
  }

  updateResource(resourceId: string, resourceData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/resources/${resourceId}`, resourceData);
  }

  deleteResource(resourceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/resources/${resourceId}`);
  }

  // Profile Management
  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateAdminProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }
} 