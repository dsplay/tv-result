import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Game } from 'src/app/models/game';
import { TournamentGame } from 'src/app/models/tournament-game';
import { GameRate } from 'src/app/models/game-rate';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ResultService } from '../../services/result.service';

const ALL_TOURNAMENTS = 9999;
const ALL_MODALITIES = 9999;
@Component({
  selector: 'app-pre-game-full',
  templateUrl: './pre-game-full.component.html',
  styleUrls: ['./pre-game-full.component.css']
})
export class PreGameFullComponent implements OnInit, OnDestroy, AfterViewInit {

  listBets;
  datesList = [];
  dateSelected = undefined;
  tournamentList: TournamentGame[] = [];
  quantifyGames = 0;
  idTournament;
  idModality;
  idDate;
  private subs = new SubSink();
  tournamentJustOneGame = [];
  tournamentJustOneGameNew = [];
  tournamentJustOneGameAuxiliary = [];
  activeCarousel = 0;


  @ViewChild('start') start: ElementRef<HTMLElement>;

  triggerFalseClick() {
    let el: HTMLElement = this.start.nativeElement;
    setInterval(() => {
      el.click();
    }, 8000);
  }

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.subs.sink = this.dataService.currentTournamentGame.subscribe(result => {

      this.datesList = this.dataService.datesList;
      this.tournamentList = result;

      this.tournamentList.forEach(tournament => {
        tournament.gameList.forEach(game => {

          this.tournamentJustOneGame.push({
            name: tournament.name,
            game
          });
        });
      });

      if (this.tournamentJustOneGame.length % 2 === 0) {
        this.tournamentJustOneGame.forEach(it => {

          if (this.tournamentJustOneGameAuxiliary.length < 2) {
            this.tournamentJustOneGameAuxiliary.push(it);
          }

          if (this.tournamentJustOneGameAuxiliary.length === 2) {
            this.tournamentJustOneGameNew.push(this.tournamentJustOneGameAuxiliary);
            this.tournamentJustOneGameAuxiliary = [];
          }

        });

      } else {

        this.tournamentJustOneGame.forEach(it => {

          if (this.tournamentJustOneGameAuxiliary.length < 2) {
            this.tournamentJustOneGameAuxiliary.push(it);
          }

          if (this.tournamentJustOneGameAuxiliary.length === 2) {
            this.tournamentJustOneGameNew.push(this.tournamentJustOneGameAuxiliary);
            this.tournamentJustOneGameAuxiliary = [];
          }

        });

        const arrayLast = [this.tournamentJustOneGame.pop()];
        this.tournamentJustOneGameNew.push(arrayLast);
      }
    });
  }

  ngAfterViewInit() {

    this.triggerFalseClick();

  }

  verifyHasThisRate(idRate: number, rates: GameRate[]): any {
    const rate = rates.find(rt => rt.id === idRate);
    return rate !== undefined ? rate : false;
  }

  getRateDecimal(value): number {
    return value.toFixed(2);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
