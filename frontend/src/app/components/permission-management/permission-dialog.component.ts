import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-permission-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Permission' : 'Add New Permission' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="permissionForm" class="permission-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter permission name">
          <mat-error *ngIf="permissionForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter permission description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="permissionForm.invalid || isLoading">
        {{ data.isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .permission-form {
      display: flex;
      flex-direction: column;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      padding: 20px 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ]
})
export class PermissionDialogComponent implements OnInit {
  permissionForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; permission?: Permission }
  ) {}

  ngOnInit(): void {
    this.permissionForm = this.formBuilder.group({
      name: [this.data.permission?.name || '', Validators.required],
      description: [this.data.permission?.description || '']
    });
  }

  onSave(): void {
    if (this.permissionForm.invalid) return;

    this.isLoading = true;
    const formValue = this.permissionForm.value;
    const permission: Permission = {
      name: formValue.name,
      description: formValue.description
    };
    if (this.data.isEdit) {
      permission.id = this.data.permission!.id;
    }

    const op$ = this.data.isEdit
      ? this.permissionService.updatePermission(this.data.permission!.id!, permission)
      : this.permissionService.createPermission(permission);

    op$.subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(
          `Permission ${this.data.isEdit ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error saving permission', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
