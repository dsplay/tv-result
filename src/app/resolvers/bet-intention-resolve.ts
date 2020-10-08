import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PendingBet } from '../models/pending-bet';
import { BetService } from '../services/bet.service';

@Injectable({
    providedIn: 'root'
})
export class BetIntetionResolve implements Resolve<PendingBet> {
    constructor(private betService: BetService, private router: Router) {
    }

    resolve(): Observable<PendingBet> {
        if (this.betService.currentQrCode) {
            return of(this.betService.currentPendingBet);
        } else {
            this.router.navigate(['']);
            return null;
        }
    }
}
