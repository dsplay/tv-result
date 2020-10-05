import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ModalAddAccountComponent } from './modal-add-account/modal-add-account.component';
import { IProduct } from 'src/app/models/product';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  @Input() eventClick: EventEmitter<any>;

  public subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const eventClick = this.eventClick;
    if (eventClick) {
      this.subscriptions.push(
        eventClick.subscribe(
          () => this.dialog.open(ModalAddAccountComponent, {
            width: '448px',
            height: '413px',
            panelClass: 'best-add-account'
          })
        )
      );
    }
  }

}
