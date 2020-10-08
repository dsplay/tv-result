import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { GameSelected } from '../models/game-selected';
import { Game } from '../models/game';
import { GameRate } from '../models/game-rate';
import { DataService } from './data.service';
import { PendingBet } from '../models/pending-bet';
import { BetOnline } from '../models/bet-online';
import { MatDialog } from '@angular/material/dialog';
import { DialogJustOneDayComponent } from '../components/dialog-just-one-day/dialog-just-one-day.component';

@Injectable({
  providedIn: 'root'
})
export class BetService {

  makeBetJustUniqueDay = false;
  currentBets = new Map<number, GameSelected>();
  currentPendingBet: PendingBet;
  currentQrCode: string;

  private emmitBets = new BehaviorSubject<Map<number, GameSelected>>(new Map());

  currentBetsEmitter = this.emmitBets.asObservable();

  constructor(private http: HttpClient, private dataService: DataService, private matDialog: MatDialog) { }

  public postBetTransaction(betValue: number, name: string): Observable<any> {
    const data = this.buildBetOnline(betValue, name);
    return this.http.post(`v1/bet`, data);
  }

  getBetImagemLink(betId: number): Observable<any> {
    return this.http.get<any>(`/api/bet/${betId}`);
  }

  addBet(game: Game, rate: GameRate): void {

    if (this.dataService.partner.noDifferentDates) {
      if (!this.verifyHasBetAnothersDay(game.gameDay)) {
        this.verifyChangeBetOrAddGame(game, rate);
      } else {
        this.justOneDayModal();
      }
    } else {
      this.verifyChangeBetOrAddGame(game, rate);
    }

  }

  private verifyHasBetAnothersDay(gameDate: string): boolean {

    let verifyHasDifferentDay = false;

    this.currentBets.forEach(it => {
      if (it.gameDay !== gameDate) {
        verifyHasDifferentDay = true;
      }
    });

    return verifyHasDifferentDay;

  }


  private verifyChangeBetOrAddGame(game: Game, rate: GameRate) {


    const findGame = this.currentBets.get(game.id);

    if (findGame && findGame.idRateType === rate.id) {
      this.currentBets.delete(findGame.id);
    } else if (findGame) {
      findGame.idRateType = rate.id;
      findGame.rateValue = rate.value;
      findGame.rateName = rate.mediumName;
    } else {
      const gameSelected = { ...game, idRateType: rate.id, rateValue: rate.value, rateName: rate.mediumName, idGame: game.id };
      delete gameSelected.rates;
      this.currentBets.set(gameSelected.id, gameSelected);
    }

    this.emmitBets.next(this.currentBets);
  }


  verifyHasThisRate(game: Game, rate: GameRate): boolean {

    const findGame = this.currentBets.get(game.id);

    if (findGame && findGame.idRateType === rate.id) {
      return true;
    } else {
      return false;
    }

  }

  emitterFullCurrent(value: Map<number, GameSelected>): void {
    this.emmitBets.next(value);
  }

  getValuesAboutCurrentBets() {
    return this.emmitBets.value;
  }

  deleteThisGame(idGame: number): void {
    this.currentBets.delete(idGame);
    this.emmitBets.next(this.currentBets);
  }

  clearAllBet(): void {
    this.currentBets.clear();
    this.emmitBets.next(this.currentBets);
  }

  buildPendingBet(betValue: number, name: string): PendingBet {
    const pendingBet = new PendingBet();
    pendingBet.pendingBetItems = Array.from(this.currentBets.values());
    pendingBet.betValue = +betValue;
    pendingBet.betReturn = parseFloat(this.getPossibleReturn(betValue));
    pendingBet.customerName = name;
    return pendingBet;
  }

  buildBetOnline(betValue: number, name: string): BetOnline {
    const betOnline = new BetOnline();
    this.currentBets.forEach(it => {
      betOnline.betItemList.push({
        idGame: it.idGame,
        idRateType: it.idRateType,
        rateValue: it.rateValue
      });
    });

    betOnline.betValue = +betValue;
    betOnline.betReturn = parseFloat(this.getPossibleReturn(betValue));
    betOnline.customerName = name;
    return betOnline;

  }

  getPossibleReturn(betValue: number): string {
    const res = this.getCalcAllRates() * betValue;
    return res.toFixed(2);
  }

  getCalcAllRates(): number {
    let rateValue = 1;
    this.currentBets.forEach(gameSelected => rateValue *= gameSelected.rateValue);
    return rateValue;
  }

  isInvalidBet(betValue: number): boolean {
    const allRatesMultiplied = this.getCalcAllRates();
    return this.isBetReturnHigherThanLimit(betValue, allRatesMultiplied) ||
      this.isBetValueLowerThanMinimum(betValue) ||
      this.isBetValueHigherThanMaximum(betValue) ||
      this.isMultiplierHigherThanMaximum(allRatesMultiplied);
  }

  private isBetReturnHigherThanLimit(betValue: number, allRatesMultiplied: number): boolean {
    if (this.dataService.partner && this.dataService.partner.maxBetReturn === 0) {
      return false;
    }
    return betValue * allRatesMultiplied > this.dataService.partner.maxBetReturn;
  }

  private isBetValueLowerThanMinimum(betValue: number): boolean {
    if (this.dataService.partner && this.dataService.partner.minBetValue === 0) {
      return false;
    }
    return betValue < this.dataService.partner.minBetValue;
  }

  private isBetValueHigherThanMaximum(betValue: number): boolean {
    if (this.dataService.partner && this.dataService.partner.maxBetValue === 0) {
      return false;
    }
    return betValue >= this.dataService.partner.maxBetValue;
  }

  private isMultiplierHigherThanMaximum(multiplier: number): boolean {
    if (this.dataService.partner && this.dataService.partner.maxMultiplier === 0) {
      return false;
    }
    return multiplier > this.dataService.partner.maxMultiplier;
  }

  saveGamesSelection(pendingBet: PendingBet): Observable<any> {

    this.currentPendingBet = pendingBet;

    return this.http.post<any>('/gateway/pendingbet', pendingBet)
      .pipe(
        map(data => (data))
      );
  }

  justOneDayModal(): void {
    this.matDialog.open(DialogJustOneDayComponent, {
      panelClass: 'custom-just-one-day'
    });
  }

  findBetDetails(id: number): Observable<any> {

    return this.http.get(`/v1/bet/${id}`);

  }

}
