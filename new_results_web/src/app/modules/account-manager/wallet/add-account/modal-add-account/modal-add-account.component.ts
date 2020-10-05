import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountManagerService } from '../../../services/account-manager.service';
import { ExternalAccount } from '../../../../../models/external-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { IAccountRequest } from '../../../../../models/account-request';

@Component({
  selector: 'app-modal-add-account',
  templateUrl: './modal-add-account.component.html',
  styleUrls: ['./modal-add-account.component.css']
})
export class ModalAddAccountComponent implements OnInit {
  public operation = {
    poupanca: '013',
    contaCorrente: '023'
  };

  background;

  public accountForm: FormGroup = new FormGroup(
    {
      bank_number: new FormControl(12, [Validators.required]),
      bank_name: new FormControl(null, [Validators.required]),
      account_type: new FormControl('023', [Validators.required]),
      agency: new FormControl(null, [Validators.required]),
      account_number: new FormControl(null, [Validators.required]),
      full_name: new FormControl(null, [Validators.required]),
      cpf: new FormControl(null, [Validators.required])
    }
  );

  constructor(private accountManagerService: AccountManagerService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ModalAddAccountComponent>) { }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }

  private parseNumber(value: string): number {
    return (new Number(value)).valueOf();
  }

  private getAccountRequest(): IAccountRequest {
    const {
      account_number,
      agency,
      bank_name,
      bank_number,
      account_type,
      cpf,
      full_name,
      operation
    } = this.accountForm.value;

    const externalAccountRequest = {
      account_data: {
        account_number: this.parseNumber(account_number),
        agency: this.parseNumber(agency),
        bank_name,
        account_type,
        bank_number: this.parseNumber(bank_number),
        cpf,
        full_name,
        operation
      },
      account_type: 'bank',
      is_main: true
    } as ExternalAccount;

    return externalAccountRequest;
  }

  mudarCor () {

    this.background = '#0BB63B';
  }

  public saveAccount() {

    this.accountManagerService.postExternalAccount(this.getAccountRequest()).subscribe(
      response => {
        this.snackBar.open(`Sucesso ao salvar conta`, 'Fechar', {
          duration: 5000
        }).afterOpened().subscribe(
          () => {
            this.accountManagerService.emitInsertAccount(response);
            this.close();
          }
        );
      },
      error => {
        this.snackBar.open(`Falha ao salvar conta`, 'Fechar', {
          duration: 5000
        });
      }
    );
  }

}
