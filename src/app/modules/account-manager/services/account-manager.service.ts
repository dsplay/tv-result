import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ExternalAccount } from 'src/app/models/external-account';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/models/product';
import { IGenericApiResponse } from 'src/app/models/generic-api-response';
import { Order } from 'src/app/models/order';
import { WithdrawResponse } from 'src/app/models/withdraw-response';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {
  private subjectAccountBalanceHook: Subject<number> = new Subject();
  private subjectInsertAccount: Subject<ExternalAccount> = new Subject();
  private subjectDeleteAccount: Subject<string> = new Subject();
  private observableInsertAccount: Observable<ExternalAccount>;
  private observableDeleteAccount: Observable<string>;
  private observableAccountBalanceHook: Observable<number>;

  constructor(private http: HttpClient) {
    this.observableInsertAccount = this.subjectInsertAccount.asObservable();
    this.observableDeleteAccount = this.subjectDeleteAccount.asObservable();
    this.observableAccountBalanceHook = this.subjectAccountBalanceHook.asObservable();
  }

  public emitUserAccountBalance(value: number): void {
    this.subjectAccountBalanceHook.next(value);
  }

  public accountBalanceHook(): Observable<number> {
    return this.observableAccountBalanceHook;
  }

  /**
   * Payment methods
   * Transactions
   */

  public getTransactions(): Observable<IGenericApiResponse> {
    return this.http.get<IGenericApiResponse>('v1/transaction');
  }

  public postOrder(data: { product_id: number; }): Observable<Order> {
    return this.http.post<Order>('v1/order', data);
  }

  public getProducts(params = { page: 1, pageLenght: 20 }): Observable<IProduct[]> {
    return this.http.get<IGenericApiResponse>(`v1/product?page=${params.page}&pageLenght=${params.pageLenght}`)
    .pipe(
      map(response => response.data)
    );
  }

  public postWithdraw(data: { external_account_id: number; value: number; }): Observable<WithdrawResponse> {
    return this.http.post<WithdrawResponse>(`v1/withdraw`, data);
  }

  /**
   * Bank Account Methods
   */

  public afterInsertAccount(): Observable<ExternalAccount> {
    return this.observableInsertAccount;
  }

  public afterDeleteAccount(): Observable<string> {
    return this.observableDeleteAccount;
  }

  public emitInsertAccount(account: ExternalAccount) {
    return this.subjectInsertAccount.next(account);
  }

  public emitDeleteAccount(accountId: string) {
    return this.subjectDeleteAccount.next(accountId);
  }

  public getExternalAccounts(): Observable<ExternalAccount[]> {
    return this.http.get('v1/external-account').pipe(
      map((response: IGenericApiResponse) => response.rows)
    );
  }

  public postExternalAccount(data: ExternalAccount): Observable<ExternalAccount> {
    return this.http.post<ExternalAccount>('v1/external-account', data);
  }

  public putUpdateExternalAccount(id: number, data: ExternalAccount): Observable<ExternalAccount> {
    return this.http.put<ExternalAccount>(`v1/external-account/${id}`, data);
  }

  public patchUpdateExternalAccount(id: number, data: ExternalAccount): Observable<ExternalAccount> {
    return this.http.patch<ExternalAccount>(`v1/external-account/${id}`, data);
  }

  public deleteExternalAccount(id: any) {
    return this.http.delete(`v1/external-account/${id}`);
  }

}
