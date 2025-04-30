import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    DatePipe
  ],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  profileData: any;
  profileForm: FormGroup;
  isEditing = false;
  selectedFile: File | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.adminService.getAdminProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.profileForm.patchValue({
          name: data.name,
          email: data.email
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue({
        name: this.profileData.name,
        email: this.profileData.email
      });
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.profileForm.patchValue({
        profilePicture: file
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        if (this.profileForm.value[key]) {
          formData.append(key, this.profileForm.value[key]);
        }
      });

      this.adminService.updateAdminProfile(formData).subscribe({
        next: (data) => {
          this.profileData = data;
          this.isEditing = false;
          this.selectedFile = null;
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 