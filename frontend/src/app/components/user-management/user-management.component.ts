import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
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
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  standalone: true
})
export class UserManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'email', 'roles', 'active', 'actions'];
  dataSource!: MatTableDataSource<User>;
  users: User[] = [];
  roles: Role[] = [];
  isLoading = true;

  private refreshSubscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        this.users = users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRoleNames(roles: Role[]): string {
    if (!roles || !roles.length) return 'None';
    return roles.map(role => role.name).join(', ');
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserActive(user.id!).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.dataSource.data = [...this.users];
        }

        const status = updatedUser.active ? 'activated' : 'deactivated';
        this.snackBar.open(`User ${status} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.snackBar.open('Error updating user status', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateUserDialog(): void {

    // const dialogRef = this.dialog.open(UserDialogComponent, {
    //   width: '500px',
    //   data: { isEdit: false }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadUsers();
    //   }
    // });
  }

  openEditUserDialog(user: User): void {
    // const dialogRef = this.dialog.open(UserDialogComponent, {
    //   width: '500px',
    //   data: { isEdit: true, user: user }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadUsers();
    //   }
    // });
  }

  confirmDeleteUser(user: User): void {

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Confirm Delete',
    //     message: `Are you sure you want to delete user "${user.name}"?`,
    //     confirmText: 'Delete'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.userService.deleteUser(user.id!).subscribe({
    //       next: () => {
    //         this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
    //         this.loadUsers();
    //       },
    //       error: (error) => {
    //         console.error('Error deleting user:', error);
    //         this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
  }
}
