import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from '../services/auth-guard.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StaticErrorHandler } from 'src/app/helpers/static/static-error-handler';
import { first } from 'rxjs/operators';
import { RouterService } from 'src/app/services/router.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isLoginForm = true;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  buttonBack = true;

  private snackBarOption: MatSnackBarConfig = {
    duration: 4000
  };

  private errorHandler: StaticErrorHandler;

  constructor(private auth: AuthGuardService, private snackBar: MatSnackBar, private router: Router, private routerService:RouterService ) {
    this.errorHandler = StaticErrorHandler.getInstance();
  }

  public get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  public get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  backToHome(): void {
    this.routerService.goBack();
  }

  public authenticateUser() {

    this.buttonBack = false;
    this.auth.authenticate(this.email.value, this.password.value).pipe(first()).subscribe(
      () => {
        this.router.navigate(['account']);
      },
      error => {
        this.snackBar.open(this.errorHandler.getErrorMessage(error.error), 'Fechar', this.snackBarOption);
      }
    );
  }


}

