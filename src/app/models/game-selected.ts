import { Game } from './game';

export class GameSelected extends Game {

    idRateType: number;
    rateValue: number;
    rateName: string;

    constructor() {
        super();
    }
}
