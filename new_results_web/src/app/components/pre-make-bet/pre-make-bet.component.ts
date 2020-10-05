import { Component, OnInit, OnDestroy } from '@angular/core';
import { BetService } from 'src/app/services/bet.service';
import { GameSelected } from 'src/app/models/game-selected';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pre-make-bet',
  templateUrl: './pre-make-bet.component.html',
  styleUrls: ['./pre-make-bet.component.css']
})
export class PreMakeBetComponent implements OnInit, OnDestroy {

  listBets: GameSelected[] = [];
  multipleValue = 1;
  betValue = 0;
  nameBet = '';
  stepOneBet = true;
  stepTwoBet = false;
  subs = new SubSink();
  mask = [];

  constructor(private betService: BetService, private router: Router, private matSnackBar: MatSnackBar) { }

  ngOnInit() {

    for (let i = 0; i < 20; i++) {
      this.mask.push(/[a-zA-Z0-9 ]/);
    }

    this.subs.sink = this.betService.currentBetsEmitter.subscribe(result => {
      this.listBets = [];
      this.multipleValue = 1;
      result.forEach(it => {
        this.listBets.push(it);
        this.multipleValue = this.multipleValue * it.rateValue;
      });
    });
  }

  getValueBet(): string {

    let value;
    if (this.betValue) {
      value = this.multipleValue * this.betValue;
    } else {
      value = 0;
    }

    return value.toFixed(2);
  }

  getFormat(value: number): string {
    return value.toFixed(2);
  }

  removeThisBet(idGame: number) {
    this.betService.deleteThisGame(idGame);
  }

  clearAllBet(): void {
    this.betService.clearAllBet();
    this.changeStep();
  }

  setValueBet(value: number): void {
    this.betValue = value;
  }

  makeBet() {

    const pendingBet = this.betService.buildPendingBet(this.betValue, this.nameBet);
    this.subs.sink = this.betService.saveGamesSelection(pendingBet)
      .subscribe(result => {
        localStorage.removeItem(`PRE_BETS`);
        this.betService.currentQrCode = result.data.qrCodeValue;
        this.router.navigateByUrl('/bet-intention');
      }, () => {
        this.matSnackBar.open('Falha ao realizar pre-aposta, contate o suporte.', 'X', {
          duration: 5000
        });
      });
  }

  qntGames(): number {
    return this.listBets.length;
  }

  noGamesSelected(): boolean {
    return this.qntGames() === 0;
  }

  verifyToMakeBet(): boolean {
    return this.noGamesSelected() || this.betService.isInvalidBet(this.betValue);
  }

  changeStep(): void {
    this.stepOneBet = !this.stepOneBet;
    this.stepTwoBet = !this.stepTwoBet;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
