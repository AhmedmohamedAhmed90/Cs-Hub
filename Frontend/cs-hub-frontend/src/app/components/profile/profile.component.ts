import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    HttpClientModule
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(0)]],
      address: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadUserProfile(this.userId);
    } else {
      this.snackBar.open('User not logged in.', 'Close', { duration: 3000 });
    }
  }

  loadUserProfile(userId: string): void {
    this.isLoading = true;
    this.http.get<User>(`${environment.apiUrl}/api/users/user-by-id/${userId}`)
      .subscribe({
        next: (user: User) => {
          this.profileForm.patchValue({
            fullName: user.fullName,
            age: user.age,
            address: user.address,
            email: user.email
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.snackBar.open('Failed to load profile. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.userId) {
      this.isLoading = true;
      const updatedUser = {
        fullName: this.profileForm.get('fullName')?.value,
        age: this.profileForm.get('age')?.value,
        address: this.profileForm.get('address')?.value
      };
      this.http.put(`${environment.apiUrl}/api/users/edit-user/${this.userId}`, updatedUser)
        .subscribe({
          next: () => {
            this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating user profile:', error);
            this.snackBar.open('Failed to update profile. Please try again.', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
    } else {
      this.snackBar.open('Form is invalid or user ID is missing.', 'Close', { duration: 3000 });
    }
  }
} 