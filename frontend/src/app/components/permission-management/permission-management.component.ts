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
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';
import { PermissionDialogComponent }   from './permission-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css'],
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
export class PermissionManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource!: MatTableDataSource<Permission>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.permissionService.getAllPermissions().subscribe({
      next: perms => {
        this.dataSource = new MatTableDataSource(perms);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading permissions', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openCreatePermissionDialog(): void {
    const ref = this.dialog.open(PermissionDialogComponent, { data: { isEdit: false } });
    ref.afterClosed().subscribe(created => {
      if (created) this.loadPermissions();
    });
  }

  openEditPermissionDialog(permission: Permission): void {
    const ref = this.dialog.open(PermissionDialogComponent, { data: { isEdit: true, permission } });
    ref.afterClosed().subscribe(updated => {
      if (updated) this.loadPermissions();
    });
  }

  confirmDeletePermission(permission: Permission): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Delete permission "${permission.name}"?`,
        confirmText: 'Delete'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.permissionService.deletePermission(permission.id!).subscribe({
        next: () => {
          this.snackBar.open('Permission deleted', 'Close', { duration: 3000 });
          this.loadPermissions();
        },
        error: () => {
          this.snackBar.open('Error deleting permission', 'Close', { duration: 3000 });
        }
      });
    });
  }
}
