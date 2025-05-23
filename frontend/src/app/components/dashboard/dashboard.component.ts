import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { AuditService } from '../../services/audit.service';
import { ActionHistory } from '../../models/action-history.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule
  ],
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  userCount = 0;
  roleCount = 0;
  permissionCount = 0;
  userRoles: string[] = [];
  userPermissions: string[] = [];
  recentActivities: ActionHistory[] = [];
  auditLogs: ActionHistory[] = [];
  isAdmin = false;
  isLoading = true;
  canViewLogs = false;
  displayedColumns: string[] = ['date', 'user', 'action', 'details'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.hasRole('ADMIN');

    if (this.isAdmin) {
      this.loadAdminDashboardData();
    } else {
      this.loadUserDashboardData();
    }
  }

  private loadAdminDashboardData(): void {
    this.canViewLogs = true; 
    
    forkJoin({
      users: this.userService.getAllUsers(),
      roles: this.roleService.getAllRoles(),
      permissions: this.permissionService.getAllPermissions(),
      activities: this.auditService.getAllActions(),
    }).subscribe({
      next: ({ users, roles, permissions, activities }) => {
        this.userCount = users.length;
        this.roleCount = roles.length;
        this.permissionCount = permissions.length;

        this.recentActivities = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        this.auditLogs = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10);

        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading admin dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  private loadUserDashboardData(): void {
    if (this.currentUser) {
      this.userRoles = Array.isArray(this.currentUser.roles) 
        ? this.currentUser.roles 
        : Object.values(this.currentUser.roles || {});

      // Load all roles to get permissions
      this.roleService.getAllRoles().subscribe({
        next: (allRoles) => {
          const userPermissions = new Set<string>();
          
          allRoles.forEach(role => {
            if (this.userRoles.includes(role.name)) {
              role.permissions.forEach(permission => {
                userPermissions.add(permission.name);
              });
            }
          });
          
          this.userPermissions = Array.from(userPermissions);
          this.permissionCount = this.userPermissions.length;
          this.roleCount = this.userRoles.length;
          
          // Check if user has VIEW_AUDIT_LOGS permission
          this.canViewLogs = this.userPermissions.includes('VIEW_AUDIT_LOGS');
          
          if (this.canViewLogs) {
            this.loadAuditLogs();
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error loading user dashboard data', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private loadAuditLogs(): void {
    this.auditService.getAllActions().subscribe({
      next: (logs) => {
        this.auditLogs = logs
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10); // Show last 10 logs
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading audit logs', err);
        this.isLoading = false;
      }
    });
  }
}