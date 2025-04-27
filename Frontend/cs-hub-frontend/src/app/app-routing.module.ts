import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReviewComponent } from './components/review/review.component';
import { CommentComponent } from './components/comment/comment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reviews/:id', component: ReviewComponent },
  { path: 'comments/:id', component: CommentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 