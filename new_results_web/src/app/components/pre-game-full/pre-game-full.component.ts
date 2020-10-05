import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Game } from 'src/app/models/game';
import { TournamentGame } from 'src/app/models/tournament-game';
import { GameRate } from 'src/app/models/game-rate';
import { BetService } from 'src/app/services/bet.service';
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


  @ViewChild ( 'start' )  start : ElementRef<HTMLElement>;

  triggerFalseClick() {
    let el: HTMLElement = this.start.nativeElement;
    setInterval(() => {

      el.click();
    }, 5000);
}


  constructor(private dataService: DataService, private betService: BetService, private resultService: ResultService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.subs.sink = this.dataService.currentTournamentGame.subscribe(result => {

      this.datesList = this.dataService.datesList;
      this.tournamentList = result;


      this.tournamentList.forEach(tournament => {
        tournament.gameList.forEach(game => {

          this.tournamentJustOneGame.push(
            {
              name: tournament.name,
              game
            }
          );
        });
      });

      this.tournamentJustOneGameNew
      this.tournamentJustOneGameAuxiliary


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

        let arrayLast = [this.tournamentJustOneGame.pop()];
        this.tournamentJustOneGameNew.push(arrayLast);
      }

      console.log(this.tournamentJustOneGameNew)

    });

  }

  ngAfterViewInit() {

    this.triggerFalseClick();

  }


  // this.subs.sink = this.betService.currentBetsEmitter.subscribe(result => {
  //   this.listBets = result.size;
  // });

  // this.datesList = this.dataService.datesList;
  // this.getDateItem();

  // this.subs.sink = this.dataService.dateListUpdate.subscribe(result => {
  //   this.datesList = result;
  //   this.getDateItem();
  // });

  // this.subs.sink = this.dataService.currentTournamentGame.subscribe(result => {
  //   this.datesList = this.dataService.datesList;
  //   this.tournamentList = result;
  //   if (!this.tournamentList) {
  //     this.tournamentList = [];
  //   }
  // });

  // this.subs.sink = this.route.params.subscribe(result => {
  //   this.decideRouterAndFilter(result);
  // });

  decideRouterAndFilter(router) {

    if (this.route.snapshot.url && this.route.snapshot.url.length === 6) {

      this.idModality = +this.route.snapshot.url[1];
      this.idTournament = +this.route.snapshot.url[3];
      this.idDate = +this.route.snapshot.url[5];

      this.dataService.filterBySportAndTournamentAndDate(this.idModality, this.idTournament, this.idDate);

    } else if (this.route.snapshot.url && this.route.snapshot.url.length === 4) {
      if (this.route.snapshot.url[0].path === 'sport' && this.route.snapshot.url[2].path === 'tournament') {

        this.idModality = +this.route.snapshot.url[1];
        this.idTournament = +this.route.snapshot.url[3];
        this.dataService.filterRouteWithSportAndTournament(this.idModality, this.idTournament);

      } else if (this.route.snapshot.url[0].path === 'tournament' && this.route.snapshot.url[2].path === 'date') {

        this.idTournament = +this.route.snapshot.url[1];
        this.idDate = +this.route.snapshot.url[3];

        this.dataService.filterByTournamentAndDate(this.idTournament, this.idDate);

      } else {

        this.idModality = +this.route.snapshot.url[1];
        this.idDate = +this.route.snapshot.url[3];

        this.dataService.filterBySportAndDate(this.idModality, this.idDate);
      }
    } else if (this.route.snapshot.url[0]) {

      const idRoute = +router.id;
      const routeName = this.route.snapshot.url[0].path;

      if (routeName === 'tournament') {
        this.idTournament = idRoute;
      } else if (routeName === 'sport') {
        this.idModality = idRoute;
      }

      this.dataService.filterGames(idRoute, routeName);
    } else {
      this.dataService.filterGames(undefined, '');
    }
  }

  getDateItem(): void {
    const dateString = localStorage.getItem('date_helper');

    this.quantifyGames = 0;
    if (this.dateSelected || this.hasDateRouter()) {
      const dateFinded = this.datesList.find(it => it.name === dateString);
      this.dateSelected = dateFinded.id;
    }

    this.datesList.forEach(it => {
      this.quantifyGames += it.value;
    });

  }

  selectThisDate(date) {

    if (date) {
      localStorage.setItem('date_helper', date.name);
      this.dateSelected = date.id;
    } else {
      this.dateSelected = date;
    }

    if (this.hasModalityRouter()) {
      if (this.hasTournamentRouter()) {
        this.router.navigateByUrl(`/sport/${this.idModality}/tournament/${this.idTournament}/date/${date.id}`);
      } else {
        this.router.navigateByUrl(`/sport/${this.idModality}/date/${date.id}`);
      }
    } else if (this.hasTournamentRouter() && date) {
      this.router.navigateByUrl(`/tournament/${this.idTournament}/date/${date.id}`);
    } else if (this.hasTournamentRouter() && !date) {
      this.router.navigateByUrl(`/tournament/${this.idTournament}`);
    } else if (date) {
      this.router.navigate(['/date', date.id]);
    } else {
      this.router.navigate(['']);
    }

  }

  hasModalityRouter(): boolean {
    return this.router.url.indexOf('sport') > 0;
  }

  hasTournamentRouter(): boolean {
    return this.router.url.indexOf('tournament') > 0;
  }

  hasDateRouter(): boolean {
    return this.router.url.indexOf('date') > 0;
  }


  addBet(game: Game, rate: GameRate): void {
    this.betService.addBet(game, rate);
  }

  verifyHasThisRate(idRate: number, rates: GameRate[]): any {
    const rate = rates.find(rt => rt.id === idRate);
    return rate !== undefined ? rate : false;
  }

  verifHasInCurrentBet(game: Game, rate: GameRate): boolean {
    return this.betService.verifyHasThisRate(game, rate);
  }

  detailGame(gameId: number) {
    this.router.navigate(['/event', gameId]);
  }

  getRateDecimal(value): number {
    return value.toFixed(2);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
