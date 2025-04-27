import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { CommentComponent } from './components/comment/comment.component';
import { ReviewComponent } from './components/review/review.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'reviews/:id', component: ReviewComponent },
  { path: 'comments/:id', component: CommentComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' },
];
