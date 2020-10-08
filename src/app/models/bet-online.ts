import { BetItemOnline } from './bet-item-online';

export class BetOnline {
    customerName?: string;
    betValue: number;
    betReturn: number;
    betItemList: BetItemOnline[] = [];
}
