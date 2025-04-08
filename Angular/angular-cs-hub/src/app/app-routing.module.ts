import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components 
import { HomeComponent } from './components/pages/home/home.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { CourseDetailComponent } from './components/pages/course-detail/course-detail.component';
import { TutorialsComponent } from './components/pages/tutorials/tutorials.component';
import { TutorialDetailComponent } from './components/pages/tutorial-detail/tutorial-detail.component';
import { ResourcesComponent } from './components/pages/resources/resources.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';

// Import guards
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:slug', component: CourseDetailComponent },
  { path: 'tutorials', component: TutorialsComponent },
  { path: 'tutorials/:slug', component: TutorialDetailComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Protected routes (require authentication)
  { 
    path: 'my-learning', 
    loadChildren: () => import('./components/pages/my-learning/my-learning.module').then(m => m.MyLearningModule),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./components/pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [authGuard]
  },
  // 404 route
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }