import { GameRate } from './game-rate';

export class Game {
  id: number;
  idTournament: number;
  dateTime: number;
  dateDayEvent: string; // preenchido depois de carregado
  visibleDate: string;
  homeTeam: string;
  awayTeam: string;
  elapsedSeconds: number;
  live: boolean;
  lastUpdate: Date;
  rates: GameRate[];
  gameDay?: string;
  ratesCount: number;
  idGame?: number;
}
