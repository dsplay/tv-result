import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountManagerRoutingModule } from './account-manager-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { HistoryComponent } from './history/history.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { MenuComponent } from './menu/menu.component';
import { MaterialModule } from 'src/app/material.module';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ModalChangePasswordComponent } from './profile/change-password/modal-change-password/modal-change-password.component';
import { AddAccountComponent } from './wallet/add-account/add-account.component';
import { ModalAddAccountComponent } from './wallet/add-account/modal-add-account/modal-add-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepositComponent } from './wallet/deposit/deposit.component';
import { ModalDepositComponent } from './wallet/deposit/modal-deposit/modal-deposit.component';
import { WithdrawComponent } from './wallet/withdraw/withdraw.component';
import { ModalWithdrawComponent } from './wallet/withdraw/modal-withdraw/modal-withdraw.component';


@NgModule({
  declarations: [
    ProfileComponent,
    WalletComponent,
    HistoryComponent,
    TransactionsComponent,
    LayoutComponent,
    MenuComponent,
    ChangePasswordComponent,
    ModalChangePasswordComponent,
    AddAccountComponent,
    ModalAddAccountComponent,
    DepositComponent,
    ModalDepositComponent,
    WithdrawComponent,
    ModalWithdrawComponent],
  imports: [
    CommonModule,
    AccountManagerRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class AccountManagerModule { }
