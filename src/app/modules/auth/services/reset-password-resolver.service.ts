import { Injectable } from '@angular/core';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordResolverService implements Resolve<any> {

  constructor(private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = route.queryParams.token;

    if (!token) {
      return this.router.navigate(['/auth/login']);
    }

    return new Promise((resolve) => resolve(token));
  }
}
