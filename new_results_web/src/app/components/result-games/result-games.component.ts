import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResultService } from 'src/app/services/result.service';
import { SubSink } from 'subsink';
import { TournamentGameResult } from 'src/app/models/tournament-game-result';


@Component({
  selector: 'app-result-games',
  templateUrl: './result-games.component.html',
  styleUrls: ['./result-games.component.scss']
})
export class ResultGamesComponent implements OnInit {

  tournamentResults: TournamentGameResult [] = [];
  activeCarousel = 0;
  private subs = new SubSink();
  tournamentJustOneGame = [];
  tournamentJustOneGameNew = [];
  tournamentJustOneGameAuxiliary = [];
 

  constructor(private resultResult: ResultService) { }

  @ViewChild ( 'start' )  start : ElementRef<HTMLElement>;

  triggerFalseClick() {
    let el: HTMLElement = this.start.nativeElement;
    setInterval(() => {

      el.click();
    }, 8000);
}

  ngOnInit(): void {

    this.subs.sink = this.resultResult.currentGamesWithResult.subscribe(result => {
      
      this.tournamentResults = result
      this.tournamentResults.forEach(tournament => {
        tournament.games.forEach(game => {

          this.tournamentJustOneGame.push(
            {
              tournament: tournament.tournamentName,
              country: tournament.countryname,
              game
              
            }
          );
        });
      });
      
      this.tournamentJustOneGameNew;
      this.tournamentJustOneGameAuxiliary;
      console.log(this.tournamentJustOneGame)


      if (this.tournamentJustOneGame.length % 4 === 0) {
        this.tournamentJustOneGame.forEach(it => {

          if (this.tournamentJustOneGameAuxiliary.length < 4) {
            this.tournamentJustOneGameAuxiliary.push(it);
          }

          if (this.tournamentJustOneGameAuxiliary.length === 4) {
            this.tournamentJustOneGameNew.push(this.tournamentJustOneGameAuxiliary);
            this.tournamentJustOneGameAuxiliary = [];
          }

        });

      } else {

        this.tournamentJustOneGame.forEach(it => {

          if (this.tournamentJustOneGameAuxiliary.length < 4) {
            this.tournamentJustOneGameAuxiliary.push(it);
          }

          if (this.tournamentJustOneGameAuxiliary.length === 4) {
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

}



