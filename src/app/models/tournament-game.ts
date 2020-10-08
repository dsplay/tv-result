import {Tournament} from './tournament';
import { Game } from './game';

export class TournamentGame {
    id: number;
    name: string;
    gameList: Game[];
    auxFind?: string;
    auxId?: string;
}

