import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { AuditService } from '../../services/audit.service';
import { ActionHistory } from '../../models/action-history.model';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  userCount = 0;
  roleCount = 0;
  permissionCount = 0;
  recentActivities: ActionHistory[] = [];
  isAdmin = false;
  isLoading = true;

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
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData(): void {
    forkJoin({
      users: this.userService.getAllUsers(),
      roles: this.roleService.getAllRoles(),
      permissions: this.permissionService.getAllPermissions(),
      activities: this.auditService.getAllActions(),
    }).subscribe({
      next: (results) => {
        this.userCount = results.users.length;
        this.roleCount = results.roles.length;
        this.permissionCount = results.permissions.length;

        this.recentActivities = results.activities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }
}
