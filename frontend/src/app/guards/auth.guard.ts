import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (this.authService.isLoggedIn()) {
      // Check for required roles if specified
      const requiredRoles = route.data['roles'] as Array<string>;
      if (requiredRoles) {
        const hasRequiredRole = requiredRoles.some(role => this.authService.hasRole(role));
        if (!hasRequiredRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }

      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
