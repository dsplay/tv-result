import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import Sport from 'src/app/models/sport';
import { TournamentGame } from 'src/app/models/tournament-game';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';

const PRE_GAME_SPORT = 1;
const CATEGORY_FILTER = 1;
const TOURNAMENT_FILTER = 2;
const DATE_FILTER = 3;
const ALL_MODALITIES = 9999;
const ALL_TOURNAMENT = 9999;

@Component({
  selector: 'app-menu-sport-tournaments',
  templateUrl: './menu-sport-tournaments.component.html',
  styleUrls: ['./menu-sport-tournaments.component.css']
})
export class MenuSportTournamentsComponent implements OnInit, OnDestroy {

  subs = new SubSink();
  sports: Sport[];
  tournaments: TournamentGame[];
  selectedSport = ALL_MODALITIES;
  allTournaments: TournamentGame[] = [];
  selectedTournament = ALL_TOURNAMENT;
  selectedMenu = PRE_GAME_SPORT;
  currentHasModalityRoute = false;
  currentHasTournamentRoute = false;
  showFilters = true;
  showNameFilter = true;
  currentlyFilter = 0;
  gamesPerDayMap = new Map<String, number>();
  datesList = [];
  quantifyAllGames = 0;
  items = [];
  nameFilter = '';
  ngModelItem = 0;
  ngModelTournament = 9999;
  ngModelCategory = 9999;
  ngModelDate = 9999;
  filterTournaments = false;
  allGamesForDate;
  quantifyChange = 0;
  textChange = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.quantifyAllGames = this.dataService.gamesList.length;
    this.sports = this.dataService.sports;

    const tournamentsWithoutLive = this.dataService.allTournamentGames;
    this.allTournaments = tournamentsWithoutLive;
    this.tournaments = tournamentsWithoutLive;
    this.datesList = this.dataService.datesList;

    this.subs.sink = this.dataService.dateListUpdate.subscribe(result => {
      this.datesList = result;
      if (this.router.url.indexOf('date') > 0) {
        this.getDateItem();
      }
    });

    this.subs.sink = this.dataService.currentTournamentId.subscribe(result => {
      this.selectedTournament = +result;
    });

    this.verifyRouterAndSetModalityAndTournament(this.router.url);

  }

  selectSport(sportId: string): void {

    this.resetValuesBySport(+sportId);

    if (+sportId !== ALL_MODALITIES) {
      this.router.navigate(['/sport', sportId]);
      this.filterTournamentByIdAndCounter(+sportId);
    } else {
      this.currentHasModalityRoute = false;
      this.currentHasTournamentRoute = false;
      this.router.navigate(['/']);
      this.tournaments = this.allTournaments;
      this.quantifyAllGames = this.dataService.gamesList.length;
    }
  }

  resetValuesBySport(sportId: number): void {
    this.currentHasModalityRoute = true;
    this.selectedTournament = undefined;
    this.selectedSport = sportId;
    this.ngModelDate = 9999;
    this.ngModelTournament = 9999;
  }

  filterTournamentByIdAndCounter(idSport: number) {

    this.quantifyAllGames = 0;
    const currentsTournaments = [];

    try {
      if (idSport !== ALL_MODALITIES) {
        this.sports.find(sport => sport.id === idSport)
          .countryList.forEach(country => {
            currentsTournaments.push(...country.tournamentList);
            country.tournamentList.forEach(it => {
              this.quantifyAllGames += it.gameList.length;
            });
          });
      } else {
        this.currentHasModalityRoute = false;
        this.sports.forEach(sport => {
          sport.countryList.forEach(country => {
            currentsTournaments.push(...country.tournamentList);
            country.tournamentList.forEach(it => {
              this.quantifyAllGames += it.gameList.length;
            });
          });
        });
      }

      this.tournaments = currentsTournaments;
    } catch (e) {

      this.currentHasModalityRoute = false;
      this.sports.forEach(sport => {
        sport.countryList.forEach(country => {
          currentsTournaments.push(...country.tournamentList);
          country.tournamentList.forEach(it => {
            this.quantifyAllGames += it.gameList.length;
          });
        });
      });

      this.tournaments = currentsTournaments;
      this.quantifyChange = this.quantifyAllGames;

    }

  }

  selectTournament(tournamentId: number) {

    this.resetValuesByTournament(tournamentId);

    if (this.currentHasModalityRoute) {
      this.router.navigateByUrl(`/sport/${this.selectedSport}/tournament/${tournamentId}`);
    } else {
      if (this.selectedSport === ALL_MODALITIES && tournamentId === ALL_TOURNAMENT) {
        this.router.navigate(['/tournament', ALL_TOURNAMENT]);
      } else if (this.selectedSport !== ALL_MODALITIES && tournamentId === ALL_TOURNAMENT) {
        this.router.navigate(['/tournament', ALL_TOURNAMENT]);
      } else if (this.selectedSport !== ALL_MODALITIES && tournamentId) {
        this.router.navigate(['/tournament', tournamentId]);
      } else if (this.selectedSport === ALL_MODALITIES && tournamentId) {
        this.router.navigate(['/tournament', tournamentId]);
      }
    }

  }

  resetValuesByTournament(tournamentId: number) {
    this.selectedTournament = tournamentId;
    this.currentHasTournamentRoute = true;
    this.ngModelDate = 9999;
  }

  goToSports(idSport: number): void {
    this.selectedMenu = idSport;
  }

  doSelectOptions(valueId: number): void {

    this.backToHome();

    if (this.currentlyFilter === CATEGORY_FILTER) {
      this.ngModelCategory = valueId;
      this.selectSport(`${valueId}`);
    } else if (this.currentlyFilter === TOURNAMENT_FILTER) {
      this.ngModelTournament = valueId;
      this.selectTournament(+valueId);
    } else {
      this.ngModelDate = valueId;
      this.selectDate(valueId);
    }
  }

  selectDate(valueId: number): void {

    if (valueId !== 9999) {
      localStorage.setItem('date_helper', this.datesList.find(it => it.id === valueId).name);
    }

    if (this.currentHasModalityRoute) {
      if (this.currentHasTournamentRoute) {
        this.router.navigateByUrl(`/sport/${this.selectedSport}/tournament/${this.selectedTournament}/date/${valueId}`);
      } else {
        this.router.navigateByUrl(`/sport/${this.selectedSport}/date/${valueId}`);
      }
    } else if (this.currentHasTournamentRoute) {
      this.router.navigateByUrl(`/tournament/${this.selectedTournament}/date/${valueId}`);
    } else {
      this.router.navigate(['/date', valueId]);
    }


  }

  verifyRouterAndSetModalityAndTournament(urlString: string): void {

    const stringRecoverItens = urlString.split('/');

    if (urlString.indexOf('sport') > 0 && urlString.indexOf('tournament') > 0 && urlString.indexOf('date') > 0) {
      this.currentHasModalityRoute = true;
      this.selectedSport = +stringRecoverItens[2];
      this.ngModelCategory = this.selectedSport;

      this.currentHasTournamentRoute = true;
      this.selectedTournament = +stringRecoverItens[4];
      this.ngModelTournament = this.selectedTournament;

      this.getDateItem();
      this.filterTournamentByIdAndCounter(this.selectedSport);

    } else if (urlString.indexOf('sport') > 0 && urlString.indexOf('date') > 0) {

      this.currentHasModalityRoute = true;
      this.selectedSport = +stringRecoverItens[2];
      this.ngModelCategory = this.selectedSport;

      this.getDateItem();

    } else if (urlString.indexOf('tournament') > 0 && urlString.indexOf('date') > 0) {

      this.currentHasModalityRoute = false;

      this.currentHasTournamentRoute = true;
      this.selectedTournament = +stringRecoverItens[2];
      this.ngModelTournament = this.selectedTournament;

      this.getDateItem();

    } else if (urlString.indexOf('sport') > 0 && urlString.indexOf('tournament') > 0) {
      this.currentHasModalityRoute = true;
      this.currentHasTournamentRoute = true;
      this.selectedSport = +stringRecoverItens[2];
      this.ngModelCategory = this.selectedSport;
      this.selectedTournament = +stringRecoverItens[4];
      this.ngModelTournament = this.selectedTournament;
      this.filterTournamentByIdAndCounter(this.selectedSport);
    } else if (urlString.indexOf('tournament') > 0) {
      this.currentHasTournamentRoute = true;
      this.selectedTournament = +stringRecoverItens[2];
      this.ngModelTournament = this.selectedTournament;
      this.currentHasModalityRoute = false;
    } else if (urlString.indexOf('sport') > 0) {
      this.currentHasModalityRoute = true;
      this.selectedSport = +stringRecoverItens[2];
      this.ngModelCategory = this.selectedSport;
      this.filterTournamentByIdAndCounter(this.selectedSport);
    } else if (urlString.indexOf('date') > 0) {
      this.getDateItem();
    }
  }

  getDateItem(): void {
    const dateString = localStorage.getItem('date_helper');
    if (this.datesList.length > 0) {
      const idDate = this.datesList.find(it => it.name === dateString).id;
      this.ngModelDate = idDate;
    }
  }

  changeScreen(filterType: number): void {

    this.textChange = '';
    this.quantifyChange = 0;

    this.showFilters = false;
    this.currentlyFilter = filterType;
    this.items = [];
    this.dataService.showComponentGames.next(false);
    switch (filterType) {
      case CATEGORY_FILTER:
        this.textChange = 'Todas modalidades';
        this.quantifyChange = this.dataService.totalTournaments;
        this.nameFilter = 'Modalidade';
        this.items = this.sports;
        this.ngModelItem = this.ngModelCategory;
        break;
      case TOURNAMENT_FILTER:
        this.buildDatesForTournament();
        break;
      case DATE_FILTER:
        this.nameFilter = 'Datas';
        this.textChange = 'Todas as datas';

        this.datesList.forEach(it => {
          this.quantifyChange += it.value;
        });

        this.items = this.datesList;
        this.ngModelItem = this.ngModelDate;
        break;
    }

  }

  buildDatesForTournament(): void {
    this.nameFilter = 'Torneio';
    this.textChange = 'Todos torneios';
    if (this.selectedSport === ALL_MODALITIES) {
      this.quantifyChange = this.dataService.gamesList.length;
      this.dataService.allTournamentGames.forEach(it => {
          this.items.push({ id: it.id, value: it.gameList.length, name: it.name });
      });
    } else {
      const sportFinded = this.sports.find(sport => sport.id === this.selectedSport);
      if (sportFinded) {
        sportFinded.countryList.forEach(country => {
          country.tournamentList.forEach(it => {
              this.quantifyChange += it.gameList.length;
              this.items.push({ id: it.id, value: it.gameList.length, name: it.name });
          });
        });
      } else {
        this.dataService.allTournamentGames.forEach(it => {
            this.quantifyChange += it.gameList.length;
            this.items.push({ id: it.id, value: it.gameList.length, name: it.name });
        });
      }
    }
    this.ngModelItem = this.ngModelTournament;
  }

  backToHome(): void {
    this.showFilters = true;
    this.showNameFilter = true;
    this.dataService.showComponentGames.next(true);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
