import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReviewComponent } from './components/review/review.component';
import { CommentComponent } from './components/comment/comment.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './components/Admin/admin-profile/admin-profile.component';
import { AdminUsersComponent } from './components/Admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './components/Admin/admin-categories/admin-categories.component';
import { AdminResourcesComponent } from './components/Admin/admin-resources/admin-resources.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reviews/:id', component: ReviewComponent },
  { path: 'comments/:id', component: CommentComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'profile', component: AdminProfileComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'resources', component: AdminResourcesComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  }
];

// ffatmat   
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
