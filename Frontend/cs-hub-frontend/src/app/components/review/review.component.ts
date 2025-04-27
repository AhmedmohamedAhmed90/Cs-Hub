import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Review {
  reviewID: number;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  resource: {
    resourceID: number;
    title: string;
  };
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  selectedRating: number = 0;
  editRating: number = 0;
  editingReview: Review | null = null;
  resourceId: number = 0;
  currentUser: any;

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
    this.selectedRating = rating;
  }

  setEditRating(rating: number): void {
    this.editRating = rating;
  }

  submitReview(): void {
    if (!this.selectedRating) return;

    const reviewData = {
      UserID: this.currentUser.id,
      ResourceID: this.resourceId,
      Rating: this.selectedRating
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.snackBar.open('Review added successfully', 'Close', { duration: 3000 });
        this.selectedRating = 0;
        this.loadReviews();
      },
      error: (err) => {
        this.snackBar.open('Error adding review', 'Close', { duration: 3000 });
      }
    });
  }

  editReview(review: Review): void {
    this.editingReview = review;
    this.editRating = review.rating;
  }

  updateReview(): void {
    if (!this.editingReview || !this.editRating) return;
    
    // Validate rating range
    if (this.editRating < 1 || this.editRating > 5) {
      this.snackBar.open('Rating must be between 1 and 5', 'Close', { duration: 3000 });
      return;
    }

    this.reviewService.updateReview(this.editingReview.reviewID, this.editRating).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Review updated successfully', 'Close', { duration: 3000 });
        }
        this.cancelEdit();
        this.loadReviews();
      },
      error: (err) => {
        console.error('Error updating review:', err);
        console.error('Error details:', err.error);
        
        let errorMessage = 'Error updating review';
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

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
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
  }

  cancelEdit(): void {
    this.editingReview = null;
    this.editRating = 0;
  }

  isUserReview(review: Review): boolean {
    return review.user.id === this.currentUser.id;
  }
} 