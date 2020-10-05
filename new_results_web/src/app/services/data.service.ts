import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import PartnerData from '../models/partner-data';
import { HttpClient } from '@angular/common/http';
import { RatePartner } from '../models/rate-partner';
import * as moment from 'moment';
import { TournamentGame } from '../models/tournament-game';
import { Tournament } from '../models/tournament';
import { Game } from '../models/game';
import Sport from '../models/sport';
import RateGroup from '../models/rate-group';
import Country from '../models/country';

const ID_TOURNAMENT_LIVE = 1;
const ID_ALL_MODALITIES = 9999;
const ID_ALL_TOURNAMENTS = 9999;
const ID_ALL_DATES = 9999;
@Injectable({
  providedIn: 'root'
})
export class DataService {

  partner: PartnerData;
  allRates: RatePartner[] = [];
  totalTournaments = 0;
  datesList = [];
  ratesGroups: RateGroup[] = [];
  gamesList: Game[] = [];
  tournaments: Tournament[];
  sports: Sport[] = [];
  datesGames = [];
  private partnerData = new Subject<PartnerData>();
  loadCompleteEmmiter = new Subject<boolean>();
  allTournamentGames: TournamentGame[] = [];
  oldTournamentGames: TournamentGame[];
  gamesPerDayMap = new Map<String, number>();
  private tournamentGamesByFilters = new BehaviorSubject<TournamentGame[]>([]);
  showComponentGames = new Subject<boolean>();
  currentRouteAndId = { id: undefined, route: undefined };
  urlPartner;
  updateThisGame = new Subject<Game>();
  dateListUpdate = new Subject<Array<any>>();

  currentTournamentId = new Subject();
  currentPartnerData = this.partnerData.asObservable();
  currentLoadComplete = this.loadCompleteEmmiter.asObservable();
  currentTournamentGame = this.tournamentGamesByFilters.asObservable();

  constructor(private http: HttpClient) { }

  setPartnerData(value): void {
    this.partnerData.next(value);
  }

  getInitDataPartner(): void {
    this.buildNewPartners();
  }

  buildNewPartners(): void {
    this.http.get<{ data: { betKeyList: RatePartner[], partner: PartnerData } , message: string }>
    ('/api/partner-info').subscribe(resultPartner => {
      this.partner = resultPartner.data.partner;
      this.allRates = resultPartner.data.betKeyList;

      this.getGamesAndTournaments();
    }, () => this.loadCompleteEmmiter.next(false));
  }

  buildDataGamesAndTournaments(sports: Sport[]): void {
    this.fillNumberOfGamesIntoTournaments(sports);
    this.loadCompleteEmmiter.next(false);
  }

  buildDatesToList(): void {

    this.datesList = [];

    let idHelpSelectedDate = 2;
    this.gamesPerDayMap.forEach((value, key) => {
      if (key) {

        const keysDate = key.split('/');

        const dateTemp = new Date(Number(keysDate[2]), Number(keysDate[1]), Number(keysDate[0]));

        this.datesList.push({ id: idHelpSelectedDate, name: key, value, temp: dateTemp });
        ++idHelpSelectedDate;
      }
    });


    this.datesList.sort((objOne, objTwo) => {

      if (objOne.temp.getTime() < objTwo.temp.getTime()) { return -1; }
      if (objTwo.temp.getTime() > objOne.temp.getTime()) { return 1; }

      return 0;
    });

  }


  createAllModalitiesAndSort(): void {
    if (this.sports.length > 1) {
      this.sports = this.sports.sort((objOne, objTwo) => {
        if (objOne.name < objTwo.name) { return -1; }
        if (objTwo.name > objTwo.name) { return 1; }
        return 0;
      });
    }

  }

  justUpdateGames(): void {
    this.http.get<{ code: number, message: string, data: Sport[] }>
      ('/gateway/game/sportList').subscribe(resultData => {

        resultData.data.forEach(it => {
          if (it.id === 50) {
            it.countryList = it.countryList.filter(country => country.id !== 998);
          }
        });

        this.updateGamesInTournament(resultData.data);

      });
  }

  updateGamesInTournament(sports: Sport[]): void {

    this.fillNumberOfGamesIntoTournaments(sports);
    this.loadCompleteEmmiter.next(false);

    if (this.currentRouteAndId.route) {
      const verifyStringRoute = this.currentRouteAndId.route.split('/');
      if (verifyStringRoute.length === 3) {

        const idsSportTournamentDate = this.currentRouteAndId.id.split('/');

        const idSport = +idsSportTournamentDate[0];
        const idTournament = +idsSportTournamentDate[1];
        const idDate = +idsSportTournamentDate[2];

        this.filterBySportAndTournamentAndDate(idSport, idTournament, idDate);

      } else if (this.currentRouteAndId.route && verifyStringRoute.length > 1) {

        if (verifyStringRoute[0] === 'sport' && verifyStringRoute[1] === 'tournament') {
          const idsSportAndTournament = this.currentRouteAndId.id.split('/');

          const idSport = +idsSportAndTournament[0];
          const idTournament = +idsSportAndTournament[1];

          this.filterRouteWithSportAndTournament(idSport, idTournament);
        } else if (verifyStringRoute[0] === 'sport' && verifyStringRoute[0] === 'date') {

          const idsSportAndDate = this.currentRouteAndId.id.split('/');

          const idSport = +idsSportAndDate[0];
          const idDate = +idsSportAndDate[1];

          this.filterBySportAndDate(idSport, idDate);
        } else if (verifyStringRoute[0] === 'tournament' && verifyStringRoute[1] === 'date') {

          const idsTournamentAndDate = this.currentRouteAndId.id.split('/');

          const idTournament = +idsTournamentAndDate[0];
          const idDate = +idsTournamentAndDate[1];

          this.filterByTournamentAndDate(idTournament, idDate);

        }

      } else if (this.currentRouteAndId.route === 'event') {
        this.updateThisGame.next(this.findThisGameAndTournamentName(this.currentRouteAndId.id).game);
      } else if (this.currentRouteAndId.id) {
        this.filterGames(this.currentRouteAndId.id, this.currentRouteAndId.route);
      }
    } else {
      this.tournamentGamesByFilters.next(this.oldTournamentGames);
    }

  }

  verifyHasTournamentGame(tournament: Tournament) {
    if (this.oldTournamentGames) {
      const tournamentFinded = this.oldTournamentGames.find(it => it.id === tournament.id);
      return tournamentFinded ? tournamentFinded : false;
    } else {
      return false;
    }
  }


  getGamesAndTournaments(): void {
    this.http.get<{ code: number, message: string, data: Sport[] }>('gateway/game/sportList').subscribe(resultData => {

      //retirando jogos ao vivo
      resultData.data.forEach(it => {
        if (it.id === 50) {
          it.countryList = it.countryList.filter(country => country.id !== 998);
        }
      });

      this.buildDataGamesAndTournaments(resultData.data);
    }, () => this.loadCompleteEmmiter.next(false));
  }


  fillNumberOfGamesIntoTournaments(sports: Sport[]): void {

    this.allTournamentGames = [];
    this.gamesPerDayMap.clear();
    this.gamesList = [];
    this.totalTournaments = 0;

    this.sports = sports;

    sports.forEach(sport => {
      sport.value = 0;
      sport.countryList.forEach(country => {
        sport.value += country.tournamentList.length;
        country.tournamentList.forEach(tournament => {
          this.allTournamentGames.push(tournament);
          this.prepareGamesInTournament(tournament, country);
        });
      });
      this.totalTournaments += sport.value;
    });

    this.buildArrayDateList();

    this.allTournamentGames = this.allTournamentGames.sort((objOne, objTwo) => {
      if (objOne.name < objTwo.name) { return -1; }
      if (objTwo.name > objOne.name) { return 1; }
      return 0;
    });

    this.oldTournamentGames = this.allTournamentGames;
    this.tournamentGamesByFilters.next(this.oldTournamentGames);
  }

  buildArrayDateList(): void {
    this.datesList = [];
    let idHelpSelectedDate = 2;

    this.gamesPerDayMap.forEach((value, key) => {
      this.datesList.push({ id: idHelpSelectedDate, name: key, value });
      ++idHelpSelectedDate;
    });

    this.datesList = this.datesList.sort((objOne, objTwo) => {

      const dateSplitOne = objOne.name.split('/');
      const dateSplitTwo = objTwo.name.split('/');

      if (dateSplitOne[1] < dateSplitTwo[1] || dateSplitOne[0] < dateSplitTwo[0]) { return -1; }
      if (dateSplitTwo[1] > dateSplitOne[1] || dateSplitTwo[0] > dateSplitOne[0]) { return 1; }
      return 0;
    });
  }

  prepareGamesInTournament(tournament: TournamentGame, country: Country) {

    this.gamesList.push(...tournament.gameList);

    tournament.auxFind = tournament.name;
    tournament.name = `${country.name} - ${tournament.name}`;
    tournament.auxId = '';

    tournament.gameList.forEach(g => {
      const date = new Date(g.dateTime);
      const sLocale = date.toLocaleDateString().split('/');

      const dateOfGamePrepared = `${sLocale[0]}/${sLocale[1]}/${sLocale[2]}`;
      let quantifyGamesByThisDate = this.gamesPerDayMap.get(dateOfGamePrepared);

      if (quantifyGamesByThisDate) {
        ++quantifyGamesByThisDate;
        this.gamesPerDayMap.set(dateOfGamePrepared, quantifyGamesByThisDate);
      } else {
        this.gamesPerDayMap.set(dateOfGamePrepared, 1);
      }
      g.visibleDate = moment(date).format('ddd D MMM HH:mm');
      g['gameDay'] = dateOfGamePrepared;

      tournament.auxFind = tournament.auxFind + g.homeTeam + g.awayTeam;
      tournament.auxId = tournament.auxId + ` - ${g.id}`;

    });

    tournament.auxFind = tournament.auxFind.toLowerCase();

  }


  filterByTournamentGamesId(id: number): void {

    if (id !== ID_ALL_MODALITIES) {

      const tournamentGame = [this.oldTournamentGames.find(it => it.id === id)];

      if (tournamentGame[0]) {
        this.buildNewDates(tournamentGame);
        this.tournamentGamesByFilters.next(tournamentGame);
      } else {
        this.buildByOldTournaments();
      }
    } else {
      this.buildByOldTournaments();
    }
  }

  buildByOldTournaments(): void {
    this.buildNewDates(this.oldTournamentGames);
    this.tournamentGamesByFilters.next(this.oldTournamentGames);
  }

  filterTournamentsByTypeSearch(term: string): void {
    if (term.trim() !== '') {
      this.tournamentGamesByFilters.next(this.oldTournamentGames.filter(it => it.auxFind.indexOf(term) > -1));
    } else {
      this.tournamentGamesByFilters.next(this.oldTournamentGames);
    }
  }

  filterTournamentsBySport(id: number): void {

    try {
      if (id !== ID_ALL_MODALITIES) {

        const currentsTournaments = [];

        this.sports.find(sport => sport.id === id)
          .countryList.forEach(country => {
            currentsTournaments.push(...country.tournamentList);
          });

        this.buildNewDates(currentsTournaments);
        this.tournamentGamesByFilters.next(currentsTournaments);
      } else {
        this.buildNewDates(this.oldTournamentGames);
        this.tournamentGamesByFilters.next(this.oldTournamentGames);
      }
    } catch (error) {
      this.buildNewDates(this.oldTournamentGames);
      this.tournamentGamesByFilters.next(this.oldTournamentGames);
    }

  }

  buildNewDates(tournaments: TournamentGame[]) {

    const newGamesPerDayMap = new Map<String, number>();

    tournaments.forEach(it => {
      it.gameList.forEach(game => {

        let quantifyGamesByThisDate = newGamesPerDayMap.get(game.gameDay);

        if (quantifyGamesByThisDate) {
          ++quantifyGamesByThisDate;
          newGamesPerDayMap.set(game.gameDay, quantifyGamesByThisDate);
        } else {
          newGamesPerDayMap.set(game.gameDay, 1);
        }
      });
    });

    this.gamesPerDayMap = newGamesPerDayMap;

    this.buildDatesToList();
    this.dateListUpdate.next(this.datesList);

  }

  filterTournamentByDate(date: string) {
    if (date !== '9999') {

      const tournamentWithThisDate = [] as TournamentGame[];

      this.oldTournamentGames.forEach(it => {

        const games = it.gameList.filter(itGame => itGame.gameDay === date);

        if (games.length > 0) {

          const tournamentNew = { gameList: games, ...it } as TournamentGame;
          tournamentNew.gameList = games;

          tournamentWithThisDate.push(tournamentNew);
        }
      });

      this.tournamentGamesByFilters.next(tournamentWithThisDate);
    } else {
      this.tournamentGamesByFilters.next(this.oldTournamentGames);
    }

  }

  findThisTournamentGame(idGame: string): TournamentGame {
    return this.oldTournamentGames.find(it => it.auxId.indexOf(idGame) > -1);
  }


  filterGames(idFilter: number, route: string): void {

    if (route === 'tournament') {
      this.fillCurrent(route, idFilter);
      this.filterByTournamentGamesId(idFilter);
    } else if (route === 'sport') {
      this.fillCurrent(route, idFilter);
      this.filterTournamentsBySport(idFilter);
    } else if (route === 'date') {
      this.fillCurrent(route, idFilter);

      const dateFilter = this.datesList.find(it => it.id === +idFilter);

      if (dateFilter) {
        this.filterTournamentByDate(dateFilter.name);
      } else {
        this.filterTournamentByDate('9999');
      }

    } else {
      this.buildNewDates(this.oldTournamentGames);
      this.tournamentGamesByFilters.next(this.oldTournamentGames);
    }

  }

  findThisGameAndTournamentName(gameId: string): { tournamentName: string, game: Game } {
    const tournamentGame = this.findThisTournamentGame(gameId);
    if (tournamentGame) {
      return { tournamentName: tournamentGame.name, game: tournamentGame.gameList.find(it => it.id === +gameId) };
    } else {
      return undefined;
    }
  }

  filterRouteWithSportAndTournament(idSport: number, idTournament: number): void {
    const name = 'sport/tournament';
    const ids = `${idSport}/${idTournament}`;
    if (idTournament !== ID_ALL_MODALITIES) {
      this.filterByTournamentGamesId(idTournament);
    } else {
      this.filterTournamentsBySport(idSport);
    }
    this.fillCurrent(name, ids);
  }

  filterBySportAndDate(idSport: number, idDate: number): void {

    const currentsTournaments = [];

    this.sports.find(sport => sport.id === idSport)
      .countryList.forEach(country => {

        if (idDate !== ID_ALL_DATES) {

          const dateFilterGames = localStorage.getItem('date_helper');

          country.tournamentList.forEach(tournament => {

            const games = tournament.gameList.filter(itGame => itGame.gameDay === dateFilterGames);
            if (games.length > 0) {
              const tournamentNew = { gameList: games, ...tournament } as TournamentGame;
              tournamentNew.gameList = games;
              currentsTournaments.push(tournamentNew);
            }
          });
        } else {
          currentsTournaments.push(...country.tournamentList);
        }
      });

    this.tournamentGamesByFilters.next(currentsTournaments);

    const name = 'sport/date';
    const ids = `${idSport}/${idDate}`;

    this.fillCurrent(name, ids);

  }

  filterBySportAndTournamentAndDate(idSport: number, idTournament: number, idDate: number): void {

    let auxTournaments = [];

    const currentsTournaments = [];

    this.sports.find(sport => sport.id === idSport)
      .countryList.forEach(country => {

        // FLUXO COM TODOS OS TORNEIOS
        if (idTournament === ID_ALL_TOURNAMENTS) {

          country.tournamentList.forEach(tournament => {

            // FLUXO COM TODOS TORNEIOS COM DATA
            if (idDate !== ID_ALL_DATES) {

              const dateFilterGames = localStorage.getItem('date_helper');

              const games = tournament.gameList.filter(game => game.gameDay === dateFilterGames);
              if (games.length > 0) {
                const tournamentNew = { gameList: games, ...tournament } as TournamentGame;
                tournamentNew.gameList = games;
                auxTournaments.push(tournamentNew);
                currentsTournaments.push(tournamentNew);
              }
              // FLUXO COM TODOS TORNEIOS SEM DATA
            } else {
              auxTournaments.push(tournament);
              currentsTournaments.push(tournament);
            }
          });
          // FLUXO COM APENAS 1 TORNEIO
        } else {

          const tournamentFinded = country.tournamentList.find(tournament => tournament.id === idTournament);

          if (tournamentFinded) {

            auxTournaments = [tournamentFinded];

            // FLUXO COM UM TORNEIO COM DATA
            if (idDate !== ID_ALL_DATES) {

              const dateFilterGames = localStorage.getItem('date_helper');

              const games = tournamentFinded.gameList.filter(game => game.gameDay === dateFilterGames);
              if (games.length > 0) {
                const tournamentNew = { gameList: games, ...tournamentFinded } as TournamentGame;
                tournamentNew.gameList = games;
                currentsTournaments.push(tournamentNew);
              }
              // FLUXO COM UM TORNEIO E SEM DATA
            } else {
              currentsTournaments.push(tournamentFinded);
            }
          }

        }
      });

    this.buildNewDates(auxTournaments);
    this.tournamentGamesByFilters.next(currentsTournaments);

    const name = 'sport/tournament/date';
    const ids = `${idSport}/${idTournament}/${idDate}`;

    this.fillCurrent(name, ids);

  }

  filterByTournamentAndDate(idTournament: number, idDate: number): void {

    let auxTournaments = [];
    let currentsTournaments = [];

    // FILTRO COM TODOS OS TORNEIOS
    if (idTournament === ID_ALL_TOURNAMENTS) {

      auxTournaments = this.oldTournamentGames;

      // TODOS TORNEIOS COM DATA
      if (idDate !== ID_ALL_DATES) {

        const dateFilterGames = localStorage.getItem('date_helper');

        this.oldTournamentGames.forEach(it => {
          const games = it.gameList.filter(game => game.gameDay === dateFilterGames);
          if (games.length > 0) {
            const tournamentNew = { gameList: games, ...it } as TournamentGame;
            tournamentNew.gameList = games;
            currentsTournaments.push(tournamentNew);
          }
        });
        // TODOS TORNEIOS SEM DATA
      } else {
        currentsTournaments = this.oldTournamentGames;
      }
      // FILTRO COM UM TORNEIO
    } else {

      const tournamentFinded = this.oldTournamentGames.find(it => it.id === idTournament);
      if (tournamentFinded) {
        auxTournaments = [tournamentFinded];

        // UM TORNEIO COM DATA
        if (idDate !== ID_ALL_DATES) {

          const dateFilterGames = localStorage.getItem('date_helper');

          const games = tournamentFinded.gameList.filter(game => game.gameDay === dateFilterGames);

          if (games.length > 0) {
            const tournamentNew = { gameList: games, ...tournamentFinded } as TournamentGame;
            tournamentNew.gameList = games;
            currentsTournaments.push(tournamentNew);
          }
          // UM TORNEIO SEM DATAS
        } else {
          currentsTournaments.push(tournamentFinded);
        }
      } else {
        currentsTournaments = this.oldTournamentGames;
        auxTournaments = currentsTournaments;
      }


    }

    this.buildNewDates(auxTournaments);
    this.tournamentGamesByFilters.next(currentsTournaments);

    const name = 'tournament/date';
    const ids = `${idTournament}/${idDate}`;

    this.fillCurrent(name, ids);


  }

  fillCurrent(route, idFilter) {
    this.currentRouteAndId.route = route;
    this.currentRouteAndId.id = idFilter;
  }

}
