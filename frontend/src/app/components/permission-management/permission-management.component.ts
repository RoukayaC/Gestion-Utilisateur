import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css'],
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
  ],
  standalone: true
})
export class PermissionManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource!: MatTableDataSource<Permission>;
  permissions: Permission[] = [];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.dataSource = new MatTableDataSource(this.permissions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.snackBar.open('Error loading permissions', 'Close', { duration: 3000 });
        this.isLoading = false;
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

  openCreatePermissionDialog(): void {
  }

  openEditPermissionDialog(permission: Permission): void {
  }

  confirmDeletePermission(permission: Permission): void {
  }
}
