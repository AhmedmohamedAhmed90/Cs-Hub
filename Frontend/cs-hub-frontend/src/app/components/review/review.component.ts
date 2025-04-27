import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviews: any[] = [];
  currentUser: any;
  resourceId: number = 0;
  userRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resourceId = +params['id'];
      this.loadReviews();
    });
  }

  loadReviews(): void {
    this.reviewService.getReviewsByResource(this.resourceId).subscribe({
      next: (response: any) => {
        this.reviews = response;
      },
      error: (err) => {
        this.snackBar.open('Error loading reviews', 'Close', { duration: 3000 });
      }
    });
  }

  setRating(rating: number): void {
    this.userRating = rating;
    this.createReview();
  }

  createReview(): void {
    const reviewData = {
      UserID: this.currentUser.id,
      ResourceID: this.resourceId,
      Rating: this.userRating
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.snackBar.open('Review added successfully', 'Close', { duration: 3000 });
        this.loadReviews();
      },
      error: (err) => {
        this.snackBar.open('Error adding review', 'Close', { duration: 3000 });
      }
    });
  }

  updateReview(reviewId: number, newRating: number): void {
    this.reviewService.updateReview(reviewId, newRating).subscribe({
      next: () => {
        this.snackBar.open('Review updated successfully', 'Close', { duration: 3000 });
        this.loadReviews();
      },
      error: (err) => {
        this.snackBar.open('Error updating review', 'Close', { duration: 3000 });
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.snackBar.open('Review deleted successfully', 'Close', { duration: 3000 });
        this.loadReviews();
      },
      error: (err) => {
        this.snackBar.open('Error deleting review', 'Close', { duration: 3000 });
      }
    });
  }

  isUserReview(review: any): boolean {
    return review.User.Id === this.currentUser.id;
  }
} 