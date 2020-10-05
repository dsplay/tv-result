import { Component, OnInit, Inject, Input } from '@angular/core';
import { ExternalAccount } from 'src/app/models/external-account';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountManagerService } from '../../../services/account-manager.service';
import { asyncScheduler, Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGuardService } from 'src/app/modules/auth/services/auth-guard.service';

@Component({
  selector: 'app-modal-withdraw',
  templateUrl: './modal-withdraw.component.html',
  styleUrls: ['./modal-withdraw.component.css']
})
export class ModalWithdrawComponent implements OnInit {
  public withdrawForm: FormGroup = new FormGroup({
    external_account_id: new FormControl(null, [Validators.required]),
    value: new FormControl(null, [Validators.required])
  });

  public confirmationForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required])
  });

  passwordForm
  @Input() form: FormGroup;
  showPassword = true;
  dontShowPassword = true;
  email;


  public accounts: ExternalAccount[] = [];

  private subjectAccount = new Subject<ExternalAccount[]>();
  public $accounts: Observable<ExternalAccount[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialogRef<ModalWithdrawComponent>,
    private snackBar: MatSnackBar,
    private accountManager: AccountManagerService,
    private authGuardService: AuthGuardService,) {
    this.$accounts = this.subjectAccount.asObservable();
  }

  ngOnInit(): void {
    asyncScheduler.schedule(
      () => this.subjectAccount.next(this.data.accounts), 350
    );

    this.authGuardService.user.subscribe(result =>  this.email = result.email);
  
  }

  public get password(): FormControl {
    return this.confirmationForm.get('password') as FormControl;
  }


  openPasswordConfirm() {
    this.dontShowPassword = !this.dontShowPassword;

  }

  public close() {
    this.dialog.close();
  }

  public confirmWithdraw() {

    console.log(this.password.value)

    this.authGuardService.authenticatePassword(this.email,this.password.value)
      .subscribe(() => {
        this.accountManager.postWithdraw(this.withdrawForm.value).subscribe(
          response => {
            this.snackBar.open(`Saque realizado! Em até 3 dias úteis a
            transferência será realizada para a conta escolhida.`, 'Fechar', {
              duration: 6000
            });
            this.accountManager.emitUserAccountBalance(response.src_checking_account.balance);
            this.dialog.close();
          },
          error => {
            this.snackBar.open( error.error , 'Fechar', {
              duration: 10000
            });
          }
        );
      }, () => {
        this.snackBar.open('A senha digitada não está correta, revise para conseguir realizar o saque.', 'X', {
          duration: 5000
         
        });
      });
  }

}
