import { Injectable } from '@angular/core';
import { RouterStateSnapshot, Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FeedBackType } from 'src/app/models/feedback-type';

@Injectable({
  providedIn: 'root'
})
export class FeedbackResolverService  implements Resolve<any> {

  constructor(private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const type = route.queryParams.type;
    const types = [FeedBackType.RESET_PASSWORD, FeedBackType.PASSWORD_RESETED];

    if (!type || !types.includes(type)) {
      return this.router.navigate(['/auth/login']);
    }

    return new Promise((resolve) => resolve(type));
  }
}
