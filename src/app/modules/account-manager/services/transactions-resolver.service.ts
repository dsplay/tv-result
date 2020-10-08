import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AccountManagerService } from './account-manager.service';
import { Transaction } from '../../../models/transaction';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsResolverService implements Resolve<Transaction[]> {

  constructor(private accountManager: AccountManagerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountManager.getTransactions().pipe(
      map(items => items.rows)
    );
  }

}
