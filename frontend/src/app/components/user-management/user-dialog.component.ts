// frontend/src/app/components/user-management/user-dialog.component.ts
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

import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { CreateUserRequest, User } from '../../models/user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  roles: Role[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; user?: User }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
  }

  private initForm(): void {
    const existingRoles = this.data.user?.roles || [];

    this.userForm = this.fb.group({
      name: [this.data.user?.name || '', Validators.required],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      password: [
        '',
        this.data.isEdit
          ? []
          : [Validators.required, Validators.minLength(6)]
      ],
      roles: [ existingRoles, Validators.required ]
    });
  }

  private loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: roles => this.roles = roles,
      error: err => {
        console.error('Error loading roles', err);
        this.snackBar.open('Error loading roles', 'Close', { duration: 3000 });
      }
    });
  }

  onSave(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const form = this.userForm.value;

    const payload: CreateUserRequest = {
      name: form.name,
      email: form.email,
      password: form.password,
      roles: form.roles
    };

    const op$ = this.data.isEdit
      ? this.userService.updateUser(this.data.user!.id!, payload)
      : this.userService.createUser(payload);

    op$.subscribe({
      next: () => {
        this.snackBar.open(
          `User ${this.data.isEdit ? 'updated' : 'created'} successfully`,
          'Close', { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: err => {
        console.error('Error saving user', err);
        this.snackBar.open('Error saving user', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
