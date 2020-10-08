import { Component, OnInit } from '@angular/core';
import { ITableColumn } from 'src/app/models/table-column';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Transaction } from '../../../models/transaction';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  

  showHistoryBet = true;
  dontShowFilter = true;

  range = new FormGroup({
  start: new FormControl(),
  end: new FormControl()
  });
  
  controlStatus = new FormControl();
  
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


  public columns: ITableColumn[] = [
    {
      label: 'Status',
      name: 'status'
    },
    {
      label: 'Data da transação',
      name: 'created_at'
    },
    {
      label: 'Tipo de transação',
      name: 'transaction_type'
    },
    {
      label: 'Valor',
      name: 'value'
    }
  ];

  public filter: {
    date: Array<{
      label: string;
      value: any;
    }>;
    status: any[],
    type: Array<{
      label: string;
      value: any;
    }>;
  } = {
    date: [],
    status: [],
    type: []
  };

  public data = [];

  private transactionList: Transaction[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.createFilters();

    this.subscriptions.push(
      this.activatedRoute.data.subscribe(
        (response: { transactions: Transaction[] }) => {
          this.transactionList = response.transactions;
          this.mapTransactionList(response.transactions);
        }
      )
    );
  }

  get startDate() {
    return this.range.get('start');
  }
  get endDate() {
    return this.range.get('end');
  }

  public isSelected(date: number) {
    return moment().month() === date;
  }

  private mapTransactionList(response: Transaction[]) {
    this.data = response.map(transaction => {
      const numberValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
      return {
        created_at: moment(transaction.created_at).format('LL'),
        status: !transaction.src_order ? 'Aguardando' : transaction.src_order.status,
        transaction_type: this.getTranscationType(transaction.destination),
        value: numberValue.format(transaction.value)
      };
    });
  }

  private getTranscationType(destination: string): string {
    if (destination === 'withdraw') {
      return 'Saque';
    } else if (destination === 'deposit') {
      return 'Depósito';
    }
  }

  private createFilters() {
    this.pushDates();
  }

  private pushDates() {
    this.filter.date = moment.months().map((month, i) => {
      return {
        label: month,
        value: i
      };
    });

    this.filter.date.unshift({
      label: "Todos",
      value: -1
    });

    this.filter.status = [
      'Aguardando',
      'Concluído',
      'Pendente',
      'Cancelado'
    ];
    this.filter.type = [
      {
        label: 'Saque',
        value: 'withdraw'
      },
      {
        label: 'Depósito',
        value: 'deposit'
      }
    ];
  }

  public filterByDate(month: string) {
    if (+month === -1) {
      return this.mapTransactionList(this.transactionList);
    }
    const filteredData = this.transactionList.filter(transaction => {
      const createdAt = moment(transaction.created_at);
      const createdAtMonth = createdAt.month();

      return createdAtMonth === +month;
    });

    this.mapTransactionList(filteredData);
  }

  /**
   * Precisar definir de onde vem esse STATUS.
   * Não há em transaction;
   */
  
  public filterByStatus() {}

  public filterByType(type: string) {
    const filteredData = this.transactionList.filter(transaction => transaction.destination === type);
    this.mapTransactionList(filteredData);
  }

  
  openAndCloseFilter() {

    this.showHistoryBet = !this.showHistoryBet;

  }


  filterDataStatus() {


  }


}
