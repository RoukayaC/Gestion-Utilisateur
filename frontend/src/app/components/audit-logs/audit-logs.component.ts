import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ActionHistory } from '../../models/action-history.model';
import { AuditService } from '../../services/audit.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  standalone: true
})
export class AuditLogsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'date', 'user', 'action', 'details'];
  dataSource!: MatTableDataSource<ActionHistory>;
  auditLogs: ActionHistory[] = [];
  users: User[] = [];
  filterForm!: FormGroup;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auditService: AuditService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.loadUsers();
    this.loadAuditLogs();
  }

  initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      userId: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.auditService.getAllActions().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.dataSource = new MatTableDataSource(this.auditLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.snackBar.open('Error loading audit logs', 'Close', { duration: 3000 });
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

  filterLogs(): void {
    const filters = this.filterForm.value;
    this.isLoading = true;

    if (filters.userId) {
      this.auditService.getUserActions(filters.userId).subscribe({
        next: (logs) => {
          this.auditLogs = logs;
          this.updateDataSource();
        },
        error: (error) => {
          console.error('Error filtering logs by user:', error);
          this.snackBar.open('Error filtering logs', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else if (filters.startDate && filters.endDate) {
      this.auditService.getActionsByDateRange(new Date(filters.startDate), new Date(filters.endDate)).subscribe({
        next: (logs) => {
          this.auditLogs = logs;
          this.updateDataSource();
        },
        error: (error) => {
          console.error('Error filtering logs by date range:', error);
          this.snackBar.open('Error filtering logs', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.loadAuditLogs();
    }
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadAuditLogs();
  }

  private updateDataSource(): void {
    this.dataSource.data = this.auditLogs;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }
}
