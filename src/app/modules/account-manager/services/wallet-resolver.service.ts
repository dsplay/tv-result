import { Injectable } from '@angular/core';
import { AuthGuardService } from '../../auth/services/auth-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { zip } from 'rxjs';
import { AccountManagerService } from './account-manager.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WalletResolverService implements Resolve<any> {

  constructor(private authGuard: AuthGuardService, private accountManager: AccountManagerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return zip(
      this.authGuard.getUser(),
      this.accountManager.getExternalAccounts(),
      this.accountManager.getProducts()
    ).pipe(
      map(([user, accounts, products]) => {
        return {
          user,
          accounts,
          products
        };
      })
    );
  }
}
