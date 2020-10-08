import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterModule } from '@angular/router';
import { TableListComponent } from './table-list/table-list.component';
import { MaterialModule } from 'src/app/material.module';
import { NgxCurrencyModule } from "ngx-currency";
import { UserHeaderComponent } from './user-header/user-header.component';
import { WalletHeaderComponent } from './wallet-header/wallet-header.component';

@NgModule({
  declarations: [
    HeaderComponent,
    UserFormComponent,
    TableListComponent,
    UserHeaderComponent,
    WalletHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NgxCurrencyModule
  ],
  exports: [
    HeaderComponent,
    UserFormComponent,
    UserHeaderComponent,
    WalletHeaderComponent,
    TableListComponent,
    NgxCurrencyModule
  ]
})
export class SharedModule { }
