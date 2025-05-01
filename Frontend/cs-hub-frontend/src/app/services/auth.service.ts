import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login, Register } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/account`;
  private userIdSubject = new BehaviorSubject<string | null>(null);
  public userId$: Observable<string | null> = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) {
    // Optionally load user ID from local storage on service initialization
    if (this.isBrowser()) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.userIdSubject.next(storedUserId);
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  login(credentials: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-user`, credentials);
  }

  register(userData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  setUserId(id: string): void {
    this.userIdSubject.next(id);
    if (this.isBrowser()) {
      localStorage.setItem('userId', id);
    }
  }

  getUserId(): string | null {
    // Try BehaviorSubject first, then localStorage if in browser
    const subjectValue = this.userIdSubject.value;
    if (subjectValue) {
      return subjectValue;
    }
    if (this.isBrowser()) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  clearUserId(): void {
    this.userIdSubject.next(null);
    if (this.isBrowser()) {
      localStorage.removeItem('userId');
    }
  }

  isLoggedIn(): boolean {
    return this.getUserId() !== null;
  }

  isAdmin(): boolean {
    if (this.isBrowser()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return currentUser.role === 'Admin';
    }
    return false;
  }
} 
