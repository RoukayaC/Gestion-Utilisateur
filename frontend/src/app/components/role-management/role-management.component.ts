import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';
import { RoleDialogComponent } from './role-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
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
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class RoleManagementComponent implements OnInit {
  displayedColumns = ['id', 'name', 'description', 'permissions', 'actions'];
  dataSource!: MatTableDataSource<Role>;
  permissions: Permission[] = [];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.loadRoles();
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: perms => this.permissions = perms,
      error: () => {}
    });
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getAllRoles().subscribe({
      next: roles => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading roles', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getPermissionNames(perms: Permission[]): string {
    return perms.map(p => p.name).join(', ');
  }

  openCreateRoleDialog(): void {
    const ref = this.dialog.open(RoleDialogComponent, { data: { isEdit: false } });
    ref.afterClosed().subscribe(created => {
      if (created) this.loadRoles();
    });
  }

  openEditRoleDialog(role: Role): void {
    const ref = this.dialog.open(RoleDialogComponent, { data: { isEdit: true, role } });
    ref.afterClosed().subscribe(updated => {
      if (updated) this.loadRoles();
    });
  }

  confirmDeleteRole(role: Role): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Delete role "${role.name}"?`,
        confirmText: 'Delete'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.roleService.deleteRole(role.id!).subscribe({
        next: () => {
          this.snackBar.open('Role deleted', 'Close', { duration: 3000 });
          this.loadRoles();
        },
        error: () => {
          this.snackBar.open('Error deleting role', 'Close', { duration: 3000 });
        }
      });
    });
  }
}
