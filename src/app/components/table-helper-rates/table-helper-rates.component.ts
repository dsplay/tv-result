import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-table-helper-rates',
  templateUrl: './table-helper-rates.component.html',
  styleUrls: ['./table-helper-rates.component.css']
})
export class TableHelperRatesComponent implements OnInit {

  rates;
  name: string;
  explanation: string;
  printed: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.rates = this.dataService.allRates;
  }

  verifyKey(rateKey: string) {
    const rate = this.rates.find(rate => rate === rateKey);
    return rate;
  }


}
