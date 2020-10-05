import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from '../services/auth-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FeedBackType } from 'src/app/models/feedback-type';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  public isPasswordForm = true;
  public passwordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  constructor(private authGuard: AuthGuardService, private snackBar: MatSnackBar, private router: Router) { }


  ngOnInit(): void {
  }

  public get email(): FormControl {
    return this.passwordForm.get('email') as FormControl;
  }

  public back() {
    this.router.navigate(['/auth/login']);
  }

  public resetPassword() {
    this.authGuard.passwordReset(this.email.value).subscribe(
      () => {
        this.router.navigate(['/auth/feedback'], {
          queryParams: {
            type: FeedBackType.RESET_PASSWORD
          }
        });
      },
      error => {
        this.snackBar.open(error.error, `Fechar`, {
          duration: 10000
        });
      }
    );
  }

}
