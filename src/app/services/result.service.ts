import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';
import { TournamentGameResult } from '../models/tournament-game-result';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  currentGamesWithResult = new BehaviorSubject([]);

  constructor(private http: HttpClient, private dataService: DataService) {}

  public getResults(): Observable<TournamentGameResult[]> {
    return this.http.get<any>(`result/result-games`);
  }

}
