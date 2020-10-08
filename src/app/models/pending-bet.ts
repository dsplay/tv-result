import { GameSelected } from './game-selected';

export class PendingBet {
    betValue: number;
    betReturn: number;
    customerName: string;
    pendingBetItems: Array<GameSelected>;
}
