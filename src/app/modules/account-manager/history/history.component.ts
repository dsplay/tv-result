import { Component, OnInit, Input } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';
import { Router } from '@angular/router';
import { BetService } from 'src/app/services/bet.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  listBets;
  quantifyAllGames = 0;
  showHistoryBet = true;
  betsUser = [];
  dontShowFilter = true;
  betData;
  showSpinner = false;
  waiting;
  panelOpenState = false;
  end;
  start;
  season;
  oldsUser;
  divFilter = false;


  range = new FormGroup({
  start: new FormControl(),
  end: new FormControl()
  });

  controlStatus = new FormControl();


  constructor(private historyService: HistoryService, private router: Router, private betService: BetService,
    private matSnackBar: MatSnackBar,) { }

  favoriteSeason: string;
  seasons = [{
    name: 'Ganha', 
    value: 'won'
  }, {
    name: 'Perdida',
    value: 'lose'
  },{
    name: 'Aguardando',
    value: 'waiting_results'
  },{
    name: 'Cancelada',
    value: 'cancelled'
  } ];

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  ngOnInit(): void {

    const initDate = new Date(2020, 6, 1);
    const endDate = new Date(2020, 10, 31);

    this.findBetHistory(initDate, endDate, undefined);

  }

  findBetHistory (initDate: Date, endDate: Date, status: string) {

    this.historyService.getHistoryBetsByDate(initDate, endDate, status )
      .subscribe(result => {
        result.rows.forEach(it => {
          this.betsUser.push({
            id: it.dst_bet_id,
            status: it.status,
            data: this.convertInFormartBr(it.created_at),
            value: Number(it.value).toFixed(2),
            award: Number(it.award).toFixed(2)
          });
        });
      this.oldsUser = this.betsUser;

      });

  }

  get startDate() {
    return this.range.get('start');
  }
  get endDate() {
    return this.range.get('end');
  }

  convertInFormartBr(string) {
    const results = string.split(' ')[0].split('-');
    return `${results[2]}/${results[1]}/${results[0]} - ${string.split(' ')[1]}`;
  }

   filterDataStatus() {

    this.showHistoryBet= true;
    this.divFilter = true;

    const dateInit = this.startDate.value.toISOString().split('T')[0];
    const dateEnd = this.endDate.value.toISOString().split('T')[0];

    this.end = dateEnd;
    this.start = dateInit;
  
    this.season = this.controlStatus.value;

    this.betsUser = this.oldsUser.filter(user => user.status === this.controlStatus.value);
  
  }


  openAndCloseFilter() {

    this.showHistoryBet = !this.showHistoryBet;

  }


  findBetDetails(id: number) {
   
    this.showSpinner = true;
    setTimeout(() => {

      this.showSpinner = false;

    }, 1545);

      this.betService.findBetDetails(id).subscribe(results => {
      this.betData = results;
      console.log(this.betData)

      this.betData.betItems.forEach(filterStatus => {

        if (filterStatus.status == "WAITING_RESULTS") {

          filterStatus.status = 'Aguardando';
        }

        else if (filterStatus.status == "WON") {

          filterStatus.status = 'Ganha';
        }

        else if (filterStatus.status == "LOSE") {

          filterStatus.status = 'Perdida';
        }

        else if (filterStatus.status == "CANCELLED") {

          filterStatus.status = 'Cancelada';
        }

        else ("status não encontrado")

      })


    }, err => {

      this.matSnackBar.open(err.error, 'X', {
        duration: 10000
      });
      

    })

  }

}

