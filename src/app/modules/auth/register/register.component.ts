import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/user';
import { StaticErrorHandler } from 'src/app/helpers/static/static-error-handler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public isRegisterForm = true;
  public registerForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    birthday: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    password_confirm: new FormControl(null, [Validators.required]),
  });

  private errorHandler: StaticErrorHandler;

  constructor(private userService: UserService, private snackBack: MatSnackBar, private router: Router) {
    this.errorHandler = StaticErrorHandler.getInstance();
  }

  ngOnInit(): void {
  }

  public createUser() {
    const data = this.registerForm.value as IUser;
    this.userService.register(data).subscribe(
      () => this.router.navigate(['/auth/login']),
      error => this.snackBack.open(this.errorHandler.getErrorMessage(error.error), 'Fechar', {
        duration: 5000
      })
    );
  }

}
