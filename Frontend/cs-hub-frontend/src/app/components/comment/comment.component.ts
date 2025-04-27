import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment, CreateCommentDto } from '../../models/comment.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  currentUser: any;
  resourceId: number = 0;
  newComment: string = '';

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resourceId = +params['id'];
      this.loadComments();
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByResource(this.resourceId).subscribe({
      next: (response: { comments: Comment[] }) => {
        this.comments = response.comments;
      },
      error: (err) => {
        this.snackBar.open('Error loading comments', 'Close', { duration: 3000 });
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      return;
    }

    const commentData: CreateCommentDto = {
      UserID: this.currentUser.id,
      ResourceID: this.resourceId,
      Content: this.newComment
    };

    this.commentService.createComment(commentData).subscribe({
      next: () => {
        this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
        this.newComment = '';
        this.loadComments();
      },
      error: (err) => {
        this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
      }
    });
  }

  updateComment(commentId: number, newContent: string): void {
    this.commentService.updateComment(commentId, newContent).subscribe({
      next: () => {
        this.snackBar.open('Comment updated successfully', 'Close', { duration: 3000 });
        this.loadComments();
      },
      error: (err) => {
        this.snackBar.open('Error updating comment', 'Close', { duration: 3000 });
      }
    });
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.snackBar.open('Comment deleted successfully', 'Close', { duration: 3000 });
        this.loadComments();
      },
      error: (err) => {
        this.snackBar.open('Error deleting comment', 'Close', { duration: 3000 });
      }
    });
  }

  isUserComment(comment: Comment): boolean {
    return comment.User.Id === this.currentUser.id;
  }
} 