import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-layout-games',
  templateUrl: './layout-games.component.html',
  styleUrls: ['./layout-games.component.css']
})
export class LayoutGamesComponent implements OnInit, OnDestroy {

  showThisComponent = true;
  subs = new SubSink();

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subs.sink = this.dataService.showComponentGames.subscribe(result => this.showThisComponent = result);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
