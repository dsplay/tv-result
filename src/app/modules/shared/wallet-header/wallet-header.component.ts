import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthGuardService } from '../../auth/services/auth-guard.service';
import { AccountManagerService } from '../../account-manager/services/account-manager.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-wallet-header',
  templateUrl: './wallet-header.component.html',
  styleUrls: ['./wallet-header.component.css']
})
export class WalletHeaderComponent implements OnInit, OnDestroy {
  public walletValue: string;
  private subscriptions: Subscription[] = [];

  constructor(private authGuard: AuthGuardService, private userService: UserService,
    private accountManager: AccountManagerService) { }

  public get isAuth(): boolean {
    return this.authGuard.isAuthenticated;
  }

  ngOnInit(): void {
    if (this.isAuth) {
      this.initSubscriptions();
    }

    this.userService.updateWallet.subscribe(result => this.walletValue = this.numberFormat(result));

  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private initSubscriptions() {
    this.subscriptions.push(
      this.authGuard.getUser().subscribe(
        response => {
          if (response.checking_account) {
            const value = response.checking_account.balance;
            this.walletValue = this.numberFormat(value);
          }
        }
      )
    );

    this.subscriptions.push(
      this.accountManager.accountBalanceHook().subscribe(
        value => this.walletValue = this.numberFormat(value)
      )
    );
  }

  private numberFormat(value: number) {
    return value.toFixed(2).replace(".", ",");
  }

}
