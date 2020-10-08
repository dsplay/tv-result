import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/models/user';
import { Subscription, Observable, Subject } from 'rxjs';
import { AccountManagerService } from '../services/account-manager.service';
import { ExternalAccount } from 'src/app/models/external-account';
import { Operation } from './operation.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProduct } from 'src/app/models/product';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  public openModalAddAccount: EventEmitter<void> = new EventEmitter();
  public openModalDeposit: EventEmitter<void> = new EventEmitter();
  public openModalWithdraw: EventEmitter<void> = new EventEmitter();
  public accountBalance = 0;

  public user: IUser;
  public accounts: ExternalAccount[] = [];
  public products: IProduct[] = [];

  private balanceSubscription: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private accountManager: AccountManagerService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe(
        response => this.setWalletData(response.wallet)
      )
    );

    this.subscriptions.push(
      this.accountManager.afterInsertAccount().subscribe(
        data => this.accounts.push(data)
      )
    );

    this.subscriptions.push(
      this.accountManager.afterDeleteAccount().subscribe(
        id => this.removeAccount(id)
      )
    );

    this.subscriptions.push(
      this.accountManager.accountBalanceHook().subscribe(
        value => this.accountBalance = value
      )
    );
  }

  public deposit() {
    this.openModalDeposit.emit();
  }

  public withdraw() {
    this.openModalWithdraw.emit();
  }

  private removeAccount(id: string) {
    const indexOf = this.accounts.findIndex(account => `${account.id}` === `${id}`);
    this.accounts.splice(indexOf, 1);
  }

  private setWalletData(data: { user: IUser; accounts: ExternalAccount[]; products: IProduct[]; }) {
    if (data.user) {
      this.user = data.user;
      this.accountBalance = data.user.checking_account.balance;
    }

    if (data.accounts) {
      this.accounts = data.accounts;
    }

    if (data.products) {
      this.products = data.products;
    }
  }

  public addAccount() {
    this.openModalAddAccount.emit();
  }

  public deleteAccount(id: string) {
    this.accountManager.deleteExternalAccount(id).subscribe(
      () => {
        this.snackBar.open(`Sucesso ao remover conta.`, 'Fechar', {
          duration: 5000
        }).afterOpened().subscribe(
          () => this.accountManager.emitDeleteAccount(id)
        );
      },
      () => {
        this.snackBar.open(`Falha ao remover conta.`, 'Fechar', {
          duration: 5000
        });
      }
    );
  }

  public numberFormat(value: number) {
    return value.toFixed(2);
  }

  public getOperationName(operation: Operation) {
    switch (operation) {
      case Operation.CURRENT:
        return 'Conta corrente';
      case Operation.SAVINGS:
        return 'Conta poupança';
    }
  }
}
