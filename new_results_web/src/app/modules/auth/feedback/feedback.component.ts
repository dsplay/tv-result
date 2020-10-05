import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeedBackType } from 'src/app/models/feedback-type';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  public isPasswordReseted: boolean;
  public isResetPassword: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private currentRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.currentRoute.data.subscribe(
        data => {
          const type: FeedBackType = data.type;
          this.isPasswordReseted = type === FeedBackType.PASSWORD_RESETED;
          this.isResetPassword = type === FeedBackType.RESET_PASSWORD;
        }
      )
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
