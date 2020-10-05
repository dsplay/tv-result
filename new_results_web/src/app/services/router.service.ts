import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class RouterService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router, private location: Location) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  goBack() {
    if (this.previousUrl !== undefined) {
      this.location.back();
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.goHome();
    }
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}
