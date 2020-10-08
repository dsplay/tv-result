import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthGuardService } from 'src/app/modules/auth/services/auth-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { StaticErrorHandler } from 'src/app/helpers/static/static-error-handler';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.css']
})
export class ModalChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup = new FormGroup({});
  public isNavigationEnabled = false;
  public isPasswordForm = true;
  private errorHandler: StaticErrorHandler;

  constructor(public dialogRef: MatDialogRef<ModalChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authGuard: AuthGuardService, private snackBar: MatSnackBar) {
      this.errorHandler = StaticErrorHandler.getInstance();
    }

  ngOnInit(): void {
    this.changePasswordForm = this.data.form;
  }

  public dismiss() {
    this.dialogRef.close();
  }

  public get currentPassword(): FormControl {
    return this.changePasswordForm.get('current_password') as FormControl;
  }

  public get newPassword() {
    return this.changePasswordForm.get('password') as FormControl;
  }

  public updatePassword() {
    this.authGuard.updatePassword(this.newPassword.value, this.currentPassword.value).pipe(first())
    .subscribe(
      () => {
        this.snackBar.open(`Senha atualizada com sucesso.`, 'Fechar', {
          duration: 5000
        });
        this.dismiss();
      },
      error => {
        this.snackBar.open(this.errorHandler.getErrorMessage(error.error), 'Fechar', {
          duration: 50000
        });
        this.dismiss();
      }
    );
  }

}
