import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalChangePasswordComponent } from './modal-change-password/modal-change-password.component';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Input() eventClick: EventEmitter<any>;

  public subscriptions: Subscription[] = [];

  public changePasswordForm: FormGroup = new FormGroup({
    current_password: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    password_confirm: new FormControl(null, [Validators.required]),
  });

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const eventClick = this.eventClick;
    if (eventClick) {
      this.subscriptions.push(
        eventClick.subscribe(
          () => this.dialog.open(ModalChangePasswordComponent, {
            width: '368px',
            height: '445px',
            panelClass: 'best-password-panel',
            data: {
              form: this.changePasswordForm,
              title: 'Alterar senha de acesso',
              buttons: {
                primary: {
                  label: 'Alterar senha'
                }
              }
            }
          })
        )
      );
    }
  }
}
