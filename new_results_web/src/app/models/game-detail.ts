import { RateGroupGame } from './rate-group-game';

export class GameDetail {
    id: number;
    tournamentId: number;
    tournamentName: string;
    dateTime: number;
    period: string;
    live: boolean;
    elapsedSeconds: number;
    homeTeam: string;
    awayTeam: string;
    rates: any;
    rateGroup: RateGroupGame[];
    score: any;
    visibleDate?: string;
}

