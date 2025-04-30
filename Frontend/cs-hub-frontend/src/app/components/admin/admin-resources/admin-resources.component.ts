import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../services/admin.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

interface Resource {
  id: string;
  title: string;
  description: string;
  uploaderName: string;
  uploadDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-resources',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    ConfirmDialogComponent
  ],
  templateUrl: './admin-resources.component.html',
  styleUrls: ['./admin-resources.component.scss']
})
export class AdminResourcesComponent implements OnInit {
  resources: Resource[] = [];
  displayedColumns: string[] = ['title', 'description', 'uploaderName', 'uploadDate', 'status', 'actions'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.adminService.getResources().subscribe({
      next: (data: Resource[]) => {
        this.resources = data;
      },
      error: (error: any) => {
        console.error('Error loading resources:', error);
      }
    });
  }

  acceptResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Accept Resource',
        message: `Are you sure you want to accept ${resource.title}?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.adminService.updateResource(resource.id, { status: 'accepted' }).subscribe({
          next: () => {
            this.loadResources();
          },
          error: () => {
            console.error('Error accepting resource');
          }
        });
      }
    });
  }

  deleteResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Resource',
        message: `Are you sure you want to delete ${resource.title}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.adminService.deleteResource(resource.id).subscribe({
          next: () => {
            this.loadResources();
          },
          error: () => {
            console.error('Error deleting resource');
          }
        });
      }
    });
  }
} 