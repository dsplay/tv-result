import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-just-one-day',
  templateUrl: './dialog-just-one-day.component.html',
  styleUrls: ['./dialog-just-one-day.component.css']
})
export class DialogJustOneDayComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogJustOneDayComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
