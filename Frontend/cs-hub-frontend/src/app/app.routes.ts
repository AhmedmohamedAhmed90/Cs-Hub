import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { CommentComponent } from './components/comment/comment.component';
import { ReviewComponent } from './components/review/review.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MyResourcesComponent } from './components/my-resources/my-resources.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminResourcesComponent } from './components/admin/admin-resources/admin-resources.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'reviews/:id', component: ReviewComponent },
  { path: 'comments/:id', component: CommentComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my-resources', component: MyResourcesComponent },
  { path: 'admin',
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, children: [
        { path: '', redirectTo: 'users', pathMatch: 'full' },
        { path: 'users', loadComponent: () => import('./components/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
        { path: 'categories', loadComponent: () => import('./components/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
        { path: 'resources', loadComponent: () => import('./components/admin/admin-resources/admin-resources.component').then(m => m.AdminResourcesComponent) },
        { path: 'profile', loadComponent: () => import('./components/admin/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent) },
      ] },
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' },
];
