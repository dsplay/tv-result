import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanLoad {

  constructor(private authGuard: AuthGuardService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.blockOrAllow();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.blockOrAllow();
  }

  private blockOrAllow() {
    if (!this.authGuard.isAuthenticated) {
      this.router.navigate(['/auth/login']);
    }

    return this.authGuard.isAuthenticated;
  }

}
