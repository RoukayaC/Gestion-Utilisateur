
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { UserDialogComponent } from './user-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class UserManagementComponent implements OnInit, OnDestroy {
  displayedColumns = ['id', 'name', 'email', 'roles', 'active', 'actions'];
  dataSource!: MatTableDataSource<User>;
  roles: Role[] = [];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  ngOnDestroy(): void {}

  private loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: roles => this.roles = roles,
      error: () => {}
    });
  }

   loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getRoleNames(roles: string[]): string {
    return roles.length
      ? roles.join(', ')
      : 'None';
  }

  openCreateUserDialog(): void {
    const ref = this.dialog.open(UserDialogComponent, { data: { isEdit: false } });
    ref.afterClosed().subscribe(created => {
      if (created) this.loadUsers();
    });
  }

  openEditUserDialog(user: User): void {
    const ref = this.dialog.open(UserDialogComponent, { data: { isEdit: true, user } });
    ref.afterClosed().subscribe(updated => {
      if (updated) this.loadUsers();
    });
  }

  confirmDeleteUser(user: User): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Delete user "${user.name}"?`,
        confirmText: 'Delete'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('User deleted', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserActive(user.id!).subscribe({
      next: updated => {
        const all = this.dataSource.data.map(u => u.id === updated.id ? updated : u);
        this.dataSource.data = all;
        this.snackBar.open(`User ${updated.active ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error updating user status', 'Close', { duration: 3000 });
      }
    });
  }
}
