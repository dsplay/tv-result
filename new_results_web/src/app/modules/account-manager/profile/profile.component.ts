import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthGuardService } from '../../auth/services/auth-guard.service';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public profileForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    birthday: new FormControl(null, [Validators.required]),
  });

  public user: IUser = {
    first_name: null,
    email: null
  } as IUser;

  public forgotPasswordEventClick: EventEmitter<any> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  constructor(private authGuard: AuthGuardService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authGuard.user.pipe(
        tap(user => this.user = user)
      ).subscribe(
        user => this.profileForm.patchValue(user)
      )
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public updateUser() {
    const { first_name, last_name, birthday } = this.profileForm.value as IUser;
    this.authGuard.patchUser(first_name, last_name, birthday).subscribe(
      () => {
        this.snackBar.open('Usuário atualizado com sucesso.', 'Fechar', {
          duration: 3000
        });
      }
    );
  }

  public changePassword() {
    this.forgotPasswordEventClick.emit();
  }

}
