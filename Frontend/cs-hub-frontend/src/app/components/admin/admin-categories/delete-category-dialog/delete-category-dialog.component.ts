import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-delete-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Delete Category</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete the category "{{data.name}}"?</p>
      <p>This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onDelete()">Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteCategoryDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteCategoryDialogComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {}

  onDelete(): void {
    this.categoryService.deleteCategory(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error: Error) => {
        console.error('Error deleting category:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 