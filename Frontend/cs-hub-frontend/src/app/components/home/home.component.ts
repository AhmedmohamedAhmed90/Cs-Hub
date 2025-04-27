import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [ResourceService, AuthService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  resources: Resource[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.resourceService.getAllResources().subscribe({
      next: (response: { resources: Resource[] }) => {
        this.resources = response.resources;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load resources';
        this.loading = false;
        console.error('Error loading resources:', err);
      }
    });
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  downloadFile(filePath: string): void {
    window.open(filePath, '_blank');
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Still perform local logout even if server request fails
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }

  isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  navigateToReviews(resourceId: number): void {
    this.router.navigate(['/reviews', resourceId]).then(success => {
      if (!success) {
        console.error('Navigation to reviews failed');
      }
    });
  }

  navigateToComments(resourceId: number): void {
    this.router.navigate(['/comments', resourceId]).then(success => {
      if (!success) {
        console.error('Navigation to comments failed');
      }
    });
  }
} 