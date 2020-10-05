import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProduct } from 'src/app/models/product';
import { AccountManagerService } from '../../../services/account-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-deposit',
  templateUrl: './modal-deposit.component.html',
  styleUrls: ['./modal-deposit.component.css']
})
export class ModalDepositComponent implements OnInit {
  public depositForm: FormGroup = new FormGroup({
    product_id: new FormControl(null, [Validators.required])
  });

  public products: IProduct[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ModalDepositComponent>,
  private accountManager: AccountManagerService,
  private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.products = this.data.products;
  }

  public close() {
    this.dialogRef.close();
  }

  /**
   * @debit
   * Idealmente seja um output, responsabilidade não é do modal.
   */
  public deposit() {
    this.accountManager.postOrder(this.depositForm.value).subscribe(
      response => {
        this.snackBar.open(`
        Solicitação de deposito realizada com sucesso.
        Você será redirecionado para o pagamento.`, null, {
          duration: 1500
        }).afterDismissed().subscribe(
          () => window.location.href = response.checkout_link
        );
      },
      error => this.snackBar.open(`Falha ao realizar depósito`, 'Fechar', { duration: 5000 })
    );
  }
}
