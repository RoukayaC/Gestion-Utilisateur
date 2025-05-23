import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ]
})
export class ProfileComponent implements OnInit {
  user: any;
  isLoading = true;
  passwordForm!: FormGroup;
  userRoles: string[] = [];
  userPermissions: string[] = [];
  isChangingPassword = false;

  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initPasswordForm();
    this.loadUserProfile();
  }

  initPasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.user = this.authService.getCurrentUser();
    
    if (this.user) {
      // Set user roles
      this.userRoles = Array.isArray(this.user.roles) 
        ? this.user.roles 
        : Object.values(this.user.roles || {});

      // Load all roles to get permissions
      this.roleService.getAllRoles().subscribe({
        next: (allRoles) => {
          // Find permissions 
          const userPermissions = new Set<string>();
          
          allRoles.forEach(role => {
            if (this.userRoles.includes(role.name)) {
              role.permissions.forEach(permission => {
                userPermissions.add(permission.name);
              });
            }
          });
          
          this.userPermissions = Array.from(userPermissions);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading user permissions', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getRoleNames(): string {
    return this.userRoles.length > 0 ? this.userRoles.join(', ') : 'No roles assigned';
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isChangingPassword = true;

    //  password 
    setTimeout(() => {
      this.isChangingPassword = false;
      this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
      this.passwordForm.reset();
    }, 1000);
  }
}