import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from '../services/auth-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedBackType } from 'src/app/models/feedback-type';
import { StaticErrorHandler } from 'src/app/helpers/static/static-error-handler';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public isPasswordForm = true;
  public token: string;
  private subscriptions: Subscription[] = [];
  private errorHandler: StaticErrorHandler;

  public resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    password_confirm: new FormControl(null, [Validators.required]),
  });

  constructor(private activatedRoute: ActivatedRoute,
    private auth: AuthGuardService, private router: Router,
    private snackBar: MatSnackBar) {
      this.errorHandler = StaticErrorHandler.getInstance();
    }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe(response => {
        const token = response.token;
        this.token = token;
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public get password(): FormControl {
    return this.resetPasswordForm.get('password') as FormControl;
  }

  public back() {
    this.router.navigate(['/auth/login']);
  }

  public resetPassword() {
    this.auth.passwordResetConfirm(this.password.value, this.token).subscribe(
      () => {
        this.router.navigate(['/auth/feedback'], {
          queryParams: {
            type: FeedBackType.PASSWORD_RESETED
          }
        });
      },
      error => this.snackBar.open(this.errorHandler.getErrorMessage(error.error), 'Fechar', {
        duration: 5000
      })
    );
  }

}
