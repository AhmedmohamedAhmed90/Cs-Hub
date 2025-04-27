import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Comment {
  commentID: number;
  resourceID: number;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  content: string;
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  newComment: string = '';
  editContent: string = '';
  editingComment: Comment | null = null;
  resourceId: number = 0;
  currentUser: any;

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
      next: (response: any) => {
        this.comments = response.comments;
      },
      error: (err) => {
        this.snackBar.open('Error loading comments', 'Close', { duration: 3000 });
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    const commentData = {
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

  editComment(comment: Comment): void {
    this.editingComment = comment;
    this.editContent = comment.content;
  }

  updateComment(): void {
    if (!this.editingComment || !this.editContent.trim()) return;

    // Validate content length
    if (this.editContent.length > 500) {
      this.snackBar.open('Comment cannot exceed 500 characters', 'Close', { duration: 3000 });
      return;
    }

    this.commentService.updateComment(this.editingComment.commentID, this.editContent).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Comment updated successfully', 'Close', { duration: 3000 });
        }
        this.cancelEdit();
        this.loadComments();
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        console.error('Error details:', err.error);
        
        let errorMessage = 'Error updating comment';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.detail) {
            errorMessage = err.error.detail;
          }
        }
        
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
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
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.editContent = '';
  }

  isUserComment(comment: Comment): boolean {
    return comment.user.id === this.currentUser.id;
  }
} 