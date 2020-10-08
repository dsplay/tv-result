import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { trigger, style, animate, transition } from '@angular/animations';
import { SubSink } from 'subsink';
import { BetService } from '../../services/bet.service';

@Component({
  selector: 'app-dialog-check-bet',
  templateUrl: './dialog-check-bet.component.html',
  styleUrls: ['./dialog-check-bet.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})

export class DialogCheckBetComponent implements OnInit {
  safeResource: SafeResourceUrl;
  betUrl = undefined;
  subs = new SubSink();
  betVisible = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private betService: BetService,
    public dialogRef: MatDialogRef<DialogCheckBetComponent>, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  requestLink() {
    this.betService.getBetImagemLink(this.data)
      .subscribe(result => {
        this.betVisible = true;
        this.safeResource = this.sanitizer.bypassSecurityTrustResourceUrl(result.result);
      });
  }

  closed(): void {
    this.dialogRef.close();
  }

}
