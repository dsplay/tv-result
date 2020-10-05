import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BetService } from 'src/app/services/bet.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelperComponent } from '../dialog-helper/dialog-helper.component';
import { SubSink } from 'subsink';
import { DialogCheckBetComponent } from '../dialog-check-bet/dialog-check-bet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  logoSrc: string;
  partnerName;
  activePre = true;
  liveGames = false;
  private searchTerms = new Subject<string>();
  betCodeInput;
  subs = new SubSink();

  constructor(private router: Router, private dataService: DataService,
    private matDialogService: MatDialog) { }

  ngOnInit() {
    // this.logoSrc = this.defineLogoSrc();
    // this.router.url === '/' ? this.activePre = true : this.activePre = false;
    this.subs.sink = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged()
    ).subscribe(term => this.dataService.filterTournamentsByTypeSearch(term.toLowerCase()));
  }

  logoClicked() {
    this.router.navigateByUrl('');
  }

  search(term: string): void {
    this.searchTerms.next(term);
    window.scrollTo(0, 0);
  }

  checkBetButtonIsAvailable(): boolean {
    return this.betCodeInput === undefined ? false : this.betCodeInput > 0;
  }

  findBet(): void {
    this.matDialogService.open(DialogCheckBetComponent, {
      panelClass: 'custom-modal-check',
      data : this.betCodeInput
    });
  }

  private defineLogoSrc(): string {
    return 'assets/img/bestgame-logo.svg';
  }

  helperModal(): void {
    this.matDialogService.open(DialogHelperComponent, {
      panelClass: 'custom-modalbox'
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
