import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EditUserDto {
  fullName: string;
  age: number;
  address: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  age: number;
  address: string;
  role: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  editUser(id: string, userData: EditUserDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-user/${id}`, userData);
  }

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/user-by-id/${id}`);
  }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/all-users`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user/${id}`);
  }

  promoteToAdmin(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/promote`, {});
  }
} 