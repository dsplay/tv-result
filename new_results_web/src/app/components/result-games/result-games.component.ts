import { Component, OnInit } from '@angular/core';
import { ResultService } from 'src/app/services/result.service';


@Component({
  selector: 'app-result-games',
  templateUrl: './result-games.component.html',
  styleUrls: ['./result-games.component.scss']
})
export class ResultGamesComponent implements OnInit {

  tournamentResults;


  constructor(private resultResult: ResultService) { }

  ngOnInit(): void {
    this.resultResult.currentGamesWithResult.subscribe(result => {
      
      this.tournamentResults = result
  
    }
      
    );
  }

}



