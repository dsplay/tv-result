import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dialog-helper',
  templateUrl: './dialog-helper.component.html',
  styleUrls: ['./dialog-helper.component.css']
})
export class DialogHelperComponent implements OnInit {

  partnerText;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogHelperComponent>,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.partnerText = this.dataService.partner.rules.split('-');
  }

  closed(): void {
    this.dialogRef.close();
  }

}
