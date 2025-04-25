import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, Login, Register } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject('API_URL') private apiUrl: string
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(loginData: Login): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/account/login-user`, loginData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        })
      );
  }

  register(registerData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/account/register`, registerData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/account/logout`, {})
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
          }
        })
      );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
} 