import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ExternalAccount } from 'src/app/models/external-account';
import { ModalWithdrawComponent } from './modal-withdraw/modal-withdraw.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  @Input() eventClick: EventEmitter<any>;
  @Input() accounts: ExternalAccount[];

  public subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const eventClick = this.eventClick;
    if (eventClick) {
      this.subscriptions.push(
        eventClick.subscribe(
          () => this.dialog.open(ModalWithdrawComponent, {
            width: '448px',
            height: '230px',
            panelClass: 'best-withdraw-account',
            data: {
              accounts: this.accounts
            }
          })
        )
      );
    }
  }

}
