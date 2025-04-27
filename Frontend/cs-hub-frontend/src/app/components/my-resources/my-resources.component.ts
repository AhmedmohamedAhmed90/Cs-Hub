import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-resources',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './my-resources.component.html',
  styleUrls: ['./my-resources.component.scss'],
  providers: [ResourceService, AuthService]
})
export class MyResourcesComponent implements OnInit {
  resources: any[] = [];
  isLoading = false;
  error: string | null = null;
  showCreateForm = false;
  showEditForm = false;
  selectedResource: any = null;
  createForm: FormGroup;
  editForm: FormGroup;
  categories: any[] = [];

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: [''],
      file: [null],
      categoryId: ['', Validators.required],
      resourceType: ['', Validators.required]
    });
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: [''],
      file: [null],
      categoryId: ['', Validators.required],
      resourceType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadResources();
    this.resourceService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.categories || res;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load categories.';
      }
    });
  }

  loadResources(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not logged in.';
      this.isLoading = false;
      return;
    }
    this.resourceService.getResourcesByUserId(userId).subscribe({
      next: (res: any) => {
        this.resources = res.resources || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load resources.';
        this.isLoading = false;
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  submitCreate(): void {
    if (this.createForm.valid) {
      const userId = this.authService.getUserId();
      const formData = new FormData();
      formData.append('Title', this.createForm.value.title);
      formData.append('Description', this.createForm.value.description);
      formData.append('URL', this.createForm.value.url);
      formData.append('CategoryID', this.createForm.value.categoryId);
      formData.append('ResourceType', this.createForm.value.resourceType);
      formData.append('UserId', userId!);
      if (this.createForm.value.file) {
        formData.append('File', this.createForm.value.file);
      }
      this.resourceService.uploadResource(formData).subscribe({
        next: () => {
          this.loadResources();
          this.showCreateForm = false;
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to create resource.';
        }
      });
    }
  }

  openEditForm(resource: any): void {
    console.log('Editing resource:', resource);
    this.selectedResource = resource;
    this.showEditForm = true;
    this.editForm.patchValue({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      categoryId: resource.category?.categoryID,
      resourceType: resource.resourceType
    });
    console.log('Edit form values after patch:', this.editForm.value);
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.selectedResource = null;
  }

  submitEdit(): void {
    if (this.editForm.valid && this.selectedResource) {
      const formData = new FormData();
      formData.append('Title', this.editForm.value.title);
      formData.append('Description', this.editForm.value.description);
      formData.append('URL', this.editForm.value.url);
      formData.append('CategoryID', this.editForm.value.categoryId);
      formData.append('ResourceType', this.editForm.value.resourceType);
      if (this.editForm.value.file) {
        formData.append('File', this.editForm.value.file);
      }
      this.resourceService.updateResource(this.selectedResource.resourceID, formData).subscribe({
        next: () => {
          this.loadResources();
          this.showEditForm = false;
          this.selectedResource = null;
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to update resource.';
        }
      });
    }
  }

  deleteResource(resourceId: number): void {
    this.resourceService.deleteResource(resourceId).subscribe({
      next: () => {
        this.loadResources();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to delete resource.';
        console.error('Delete error:', err);
      }
    });
  }

  onFileChange(event: any, form: FormGroup): void {
    if (event.target.files && event.target.files.length > 0) {
      form.patchValue({ file: event.target.files[0] });
    }
  }
} 