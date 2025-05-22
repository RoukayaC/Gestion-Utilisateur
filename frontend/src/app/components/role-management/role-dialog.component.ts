import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-role-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Role' : 'Add New Role' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="roleForm" class="role-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter role name">
          <mat-error *ngIf="roleForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter role description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Permissions</mat-label>
          <mat-select formControlName="permissions" multiple>
            <mat-option *ngFor="let permission of permissions" [value]="permission.id">
              {{ permission.name }} - {{ permission.description }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="roleForm.invalid || isLoading">
        {{ data.isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .role-form {
      display: flex;
      flex-direction: column;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      padding: 20px 0;
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  standalone: true
})
export class RoleDialogComponent implements OnInit {
  roleForm!: FormGroup;
  permissions: Permission[] = [];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; role?: Role }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPermissions();
  }

  initForm(): void {
    this.roleForm = this.formBuilder.group({
      name: [this.data.role?.name || '', Validators.required],
      description: [this.data.role?.description || ''],
      permissions: [this.data.role?.permissions?.map(p => p.id) || []]
    });
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.snackBar.open('Error loading permissions', 'Close', { duration: 3000 });
      }
    });
  }

  onSave(): void {
    if (this.roleForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.roleForm.value;

    const role: Role = {
      name: formValue.name,
      description: formValue.description,
      permissions: this.permissions.filter(p => formValue.permissions.includes(p.id))
    };

    if (this.data.isEdit) {
      role.id = this.data.role!.id;
    }

    const operation = this.data.isEdit
      ? this.roleService.updateRole(this.data.role!.id!, role)
      : this.roleService.createRole(role);

    operation.subscribe({
      next: (savedRole) => {
        this.isLoading = false;
        const action = this.data.isEdit ? 'updated' : 'created';
        this.snackBar.open(`Role ${action} successfully`, 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving role:', error);
        this.snackBar.open('Error saving role', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
