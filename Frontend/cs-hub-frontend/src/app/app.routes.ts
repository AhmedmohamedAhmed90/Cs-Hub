import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'login' },
];
