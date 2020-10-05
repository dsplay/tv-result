import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/models/game';
import { GameRate } from 'src/app/models/game-rate';
import { BetService } from 'src/app/services/bet.service';
import { RouterService } from 'src/app/services/router.service';
import { SubSink } from 'subsink';
import RateGroup from 'src/app/models/rate-group';
import { GameService } from 'src/app/services/game.service';
import { GameDetail } from 'src/app/models/game-detail';
import * as moment from 'moment';

@Component({
  selector: 'app-pre-game-detail',
  templateUrl: './pre-game-detail.component.html',
  styleUrls: ['./pre-game-detail.component.css']
})
export class PreGameDetailComponent implements OnInit, OnDestroy {

  tournamentName;
  game: GameDetail;
  groupsRates: RateGroup[] = [];
  subs = new SubSink();
  rates = [];
  loadingGameRate = true;
  visibleDateGame: string;
  home = [];
  away = [];
  draw = [];
  homeInterval = [];
  awayInterval = [];
  drawInterval = [];
  constructor(private dataService: DataService, private route: ActivatedRoute, private betService: BetService, private router: Router,
    private routerService: RouterService, private gameService: GameService) { }

  ngOnInit() {

    this.subs.sink = this.route.params.subscribe(result => {

      this.dataService.currentRouteAndId.id = result.id;
      this.dataService.currentRouteAndId.route = `event`;

      const id = +result.id;

      if (isNaN(id)) {
        this.router.navigate(['']);
      }

      this.subs.sink = this.gameService.getGameDetailGroup(id)
        .subscribe(resultRequest => {
          if (resultRequest.code === 200) {
            this.game = resultRequest.data;
            this.visibleDateGame = moment(this.game.dateTime).format('ddd D MMM HH:mm');
            this.tournamentName = this.game.tournamentName;
            this.buildRates(this.game.rateGroup);
            this.loadingGameRate = false;
          } else {
            this.router.navigate(['']);
            this.loadingGameRate = false;
          }
        }, () => {
          this.router.navigate(['']);
          this.loadingGameRate = false;
        });

    });

    this.subs.sink = this.dataService.updateThisGame.subscribe(() => {
      this.subs.sink = this.gameService.getGameDetailGroup(this.game.id)
        .subscribe(resultRequest => {
          if (resultRequest.code === 200) {
            this.game = resultRequest.data;
            this.buildRates(this.game.rateGroup);
          } else {
            this.router.navigate(['']);
            this.loadingGameRate = false;
          }
        });
    });
  }

  ordenateRates(): void {
    this.game.rateGroup.forEach(it => {
      if (it.name === 'Resultado Correto' || it.name === 'Intervalo - Resultado Correto') {

        it.rates = it.rates.sort((objOne, objTwo) => {
          if (objOne.name > objTwo.name) { return -1; }
          if (objTwo.name <= objTwo.name) { return 1; }
          return 0;
        });
      }
    });
  }

  buildRates(ratesGroup) {

    ratesGroup.forEach(rtGp => {
      if (rtGp.name === 'Resultado Correto') {

        rtGp.rates.forEach((it) => {

          const valueRate = it.name.split('x');

          if (valueRate[0] > valueRate[1]) {

            const index = this.home.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.home[index] = it;
            } else {
              this.home.push(it);
            }

          } else if (valueRate[0] === valueRate[1]) {

            const index = this.draw.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.draw[index] = it;
            } else {
              this.draw.push(it);
            }

          } else {

            const index = this.away.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.away[index] = it;
            } else {
              this.away.push(it);
            }

          }
        });

        this.home.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });

        this.away.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });
        this.draw.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });

        rtGp.rates = [];

      } else if (rtGp.name === 'Intervalo - Resultado Correto') {
        rtGp.rates.forEach(it => {

          const valueRate = it.name.split('X');

          const valueHome = Number(valueRate[0].split('-')[1]);
          const valueAway = Number(valueRate[1]);

          if (valueHome > valueAway) {

            const index = this.homeInterval.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.homeInterval[index] = it;
            } else {
              this.homeInterval.push(it);
            }

          } else if (valueHome === valueAway) {

            const index = this.drawInterval.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.drawInterval[index] = it;
            } else {
              this.drawInterval.push(it);
            }
          } else {

            const index = this.awayInterval.findIndex(rate => rate.id === it.id);

            if (index >= 0) {
              this.awayInterval[index] = it;
            } else {
              this.awayInterval.push(it);
            }
          }
        });

        this.homeInterval.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });

        this.awayInterval.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });
        this.drawInterval.sort((it, it2) => {
          if (it.name > it2.name) return 1;
          if (it.name < it2.name) return -1;
          return 0;
        });

        rtGp.rates = [];
      }
    });

  }

  verifyHasRates(rateKey) {
    const ratesQuantify = this.game.rates.filter(it => it.group === rateKey).length;
    return ratesQuantify > 0 ? true : false;
  }

  getValueRate(value) {
    return value.toFixed(2);
  }

  addBet(game: Game, rate: GameRate): void {
    this.betService.addBet(game, rate);
  }

  verifHasInCurrentBet(game: Game, rate: GameRate): boolean {
    return this.betService.verifyHasThisRate(game, rate);
  }

  backToHome(): void {
    this.routerService.goBack();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}