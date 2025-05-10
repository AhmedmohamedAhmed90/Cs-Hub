import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ResourceService } from '../../../services/resource.service';
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
  ],
  templateUrl: './admin-resources.component.html',
  styleUrls: ['./admin-resources.component.scss']
})
export class AdminResourcesComponent implements OnInit {
  resources: Resource[] = [];
  displayedColumns: string[] = ['title', 'description', 'uploaderName', 'uploadDate', 'status', 'actions'];

  constructor(
    private resourceService: ResourceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getAllResources().subscribe({
      next: (data: any) => {
        this.resources = (data.resources || data).map((r: any) => ({
          id: r.resourceID,
          title: r.title,
          description: r.description,
          uploaderName: r.user?.fullName,
          uploadDate: r.createdAt,
          status: r.status?.toLowerCase() // ✅ ده السطر المهم
        }));
      },
      error: (error: any) => {
        console.error('Error loading resources:', error);
      }
    });
  }


  aacceptResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approve Resource',
        message: Are you sure you want to approve the resource "${resource.title}"?
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.resourceService.approveResource(Number(resource.id)).subscribe({
          next: () => {
            this.loadResources();
          },
          error: () => {
            console.error('Error approving resource');
          }
        });
      }
    });
  }

  deleteResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Resource',
        message: Are you sure you want to delete ${resource.title}? This action cannot be undone.
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.resourceService.deleteResource(Number(resource.id)).subscribe({
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
