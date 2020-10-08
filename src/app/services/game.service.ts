import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { GameDetail } from '../models/game-detail';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getGameDetail(idGame: number): Observable<{ code: number, data: Game, message: string }> {
    return this.http.get<{ code: number, data: Game, message: string }>(`gateway/game/gameDetails/${idGame}`);
  }

  getGameDetailGroup(idGame: number): Observable<{ code: number, data: GameDetail, message: string }> {
    return this.http.get<{ code: number, data: GameDetail, message: string }>(`gateway/game/gameDetailsGrouped/${idGame}`);
  }
}
