import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './services/data.service';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { SubSink } from 'subsink';
import { ResultService } from './services/result.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/*Este contador começa à requisitar jogos ao vivo após a cada 15 segundos.*/
const updateCallerTimer = timer(30000, 45000);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isLoading = true;
  subs = new SubSink();

  constructor(private dataService: DataService, private resultService: ResultService, private matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    moment.locale('pt');

    this.subs.sink = this.dataService.currentLoadComplete.subscribe(resultLoading => {
      this.isLoading = resultLoading;
    });

    this.resultService.getResults()
    .subscribe(result => {
     this.resultService.currentGamesWithResult.next(result);
     this.isLoading = false;
    }, (erro) => {

      this.matSnackBar.open(erro.error.message, 'X', {
        duration: 10000
      });

      this.isLoading = false; 
    
    });

    this.dataService.getGamesAndTournaments();

    // this.dataService.getInitDataPartner();
    // this.subs.sink = updateCallerTimer.subscribe(() => this.updateListGames());
  }

  private updateListGames(): void {
    this.dataService.justUpdateGames();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
