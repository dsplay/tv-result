import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalDepositComponent } from './modal-deposit/modal-deposit.component';
import { IProduct } from 'src/app/models/product';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  @Input() eventClick: EventEmitter<void>;
  @Input() products: IProduct[];

  public subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const eventClick = this.eventClick;
    if (eventClick) {
      this.subscriptions.push(
        eventClick.subscribe(
          () => this.dialog.open(ModalDepositComponent, {
            width: '448px',
            height: '413px',
            panelClass: 'best-add-account',
            data: {
              products: this.products
            }
          })
        )
      );
    }
  }

}
