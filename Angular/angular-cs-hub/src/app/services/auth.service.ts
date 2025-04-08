import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'cs_hub_auth_token';
  private userKey = 'cs_hub_user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        // Invalid user JSON, clear storage
        this.clearAuth();
      }
    }
  }

  private saveAuth(response: AuthResponse): void {
    const { user, token } = response;
    
    // Save token and user to localStorage
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    // Update user with token
    const userWithToken: User = {
      ...user,
      token
    };
    
    // Update current user subject
    this.currentUserSubject.next(userWithToken);
  }

  public clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/account/login`, 
      loginData
    ).pipe(
      tap((response: AuthResponse) => this.saveAuth(response))
    );
  }

  public register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/account/register`, 
      registerData
    );
    // Not saving auth on register as we typically redirect to login after registration
  }

  public logout(): Observable<any> {
    if (!this.isLoggedIn()) {
      return throwError(() => new Error('Not logged in'));
    }
    
    return this.http.post<any>(
      `${environment.apiUrl}/account/logout`, 
      {}
    ).pipe(
      tap(() => this.clearAuth())
    );
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/account/refresh-token`,
      {}
    ).pipe(
      tap((response: AuthResponse) => this.saveAuth(response))
    );
  }
}