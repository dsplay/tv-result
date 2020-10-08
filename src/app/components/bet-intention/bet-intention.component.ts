import { Component, OnInit } from '@angular/core';
import { BetService } from 'src/app/services/bet.service';
import { PendingBet } from 'src/app/models/pending-bet';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { GameSelected } from 'src/app/models/game-selected';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGuardService } from 'src/app/modules/auth/services/auth-guard.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bet-intention',
  templateUrl: './bet-intention.component.html',
  styleUrls: ['./bet-intention.component.css']
})
export class BetIntentionComponent implements OnInit {
  codeQr: string;
  pendingItem: PendingBet;
  games: GameSelected[];
  shareContent: string;

  constructor(private betService: BetService,
    private router: Router,
    private userService: UserService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private authGuard: AuthGuardService) { }

  ngOnInit(): void {
    this.pendingItem = this.route.snapshot.data['currentBet'];
    this.codeQr = this.betService.currentQrCode;
    this.shareContent = `Pré-ticket da aposta é: ${this.codeQr}`;
    this.games = this.betService.currentPendingBet.pendingBetItems;
  }

  getTournamentName(idGame: number): string {
    return this.dataService.findThisTournamentGame(`${idGame}`).name;
  }

  public payBet() {
    this.betService.postBetTransaction(this.pendingItem.betValue, this.pendingItem.customerName)
    .subscribe(
      response => {

        const newBallance = response.src_checking_account.balance;
        this.userService.updateWallet.next(newBallance);

        this.matSnackBar.open('Apostar realizada com sucesso, verifique o status no histórico de apostas.', 'X', {
          duration: 10000
        });
      },
      error => {
        this.matSnackBar.open(`Falha a realizar a aposta, contate o suporte.`, 'Fechar', {
          duration: 5000
        });
      }
    );
  }

  getFormat(value: number): string {
    return value.toFixed(2);
  }

  getToBack(): void {
    this.router.navigateByUrl('');
    this.betService.clearAllBet();
  }

  public get isAuth(): boolean {
    return this.authGuard.isAuthenticated;
  }
}
