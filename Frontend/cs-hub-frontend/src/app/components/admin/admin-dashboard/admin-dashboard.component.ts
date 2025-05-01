import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminCategoriesComponent } from '../admin-categories/admin-categories.component';
import { AdminResourcesComponent } from '../admin-resources/admin-resources.component';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    RouterModule,
    AdminUsersComponent,
    AdminCategoriesComponent,
    AdminResourcesComponent,
    AdminProfileComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in and is admin
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    if (route === 'profile') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate([`/admin/${route}`]);
    }
  }
} 