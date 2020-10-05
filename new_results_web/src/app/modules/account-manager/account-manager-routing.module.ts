import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { HistoryComponent } from './history/history.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LayoutComponent } from './layout/layout.component';
import { WalletResolverService } from './services/wallet-resolver.service';
import { TransactionsResolverService } from './services/transactions-resolver.service';


const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'profile'
  },
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'wallet', component: WalletComponent, resolve: {
          wallet: WalletResolverService
        }
      },
      {
        path: 'history', component: HistoryComponent
      },
      {
        path: 'transactions', component: TransactionsComponent, resolve: {
          transactions: TransactionsResolverService
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagerRoutingModule { }
