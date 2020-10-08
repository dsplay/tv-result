import { EventEmitter, Injectable } from '@angular/core';
import { ITokenResponse } from 'src/app/models/token-response';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, asyncScheduler } from 'rxjs';
import { map, tap, debounceTime, share } from 'rxjs/operators';
import { IUser } from 'src/app/models/user';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  public userObserver: Observable<IUser>;

  private storage: Storage;
  private memoryToken: ITokenResponse;

  /**
   * Responsabilidade do AuthGuard
   */
  private authenticatedUser: IUser;
  private subjectUser: Subject<IUser>;

  constructor(private http: HttpClient) {
    this.subjectUser = new Subject();
    this.userObserver = this.subjectUser.asObservable();
    this.memoryToken = this.generateDefaultObject();
    this.storage = localStorage;
    this.onLoadToken();
  }

  /**
   * Retorna o token atual do usuário logado.
   */
  public get token(): string {
    return this.memoryToken.token;
  }

  /**
   * Retorna o token de refresh utilizado para atualizar a sessão do usuário.
   */
  public get refreshToken(): string {
    return this.memoryToken.refreshToken;
  }

  /**
   * Retorna o tipo de autenticação disponiblizada pela api.
   */
  public get type(): string {
    return this.memoryToken.type;
  }

  /**
   * Valida se há algum usuário autenticado de acordo com o storage.
   */
  public get isAuthenticated(): boolean {
    return this.memoryToken.token !== null;
  }

  /**
   * Retorna o usuário autenticado (Obtém através do endpoint ou faz a request).
   */
  public get user(): Observable<IUser> {
    if (this.authenticatedUser) {
      asyncScheduler.schedule(() => this.subjectUser.next(this.authenticatedUser));
    } else {
      return this.getUser().pipe(
        map((response: IUser) => {
          this.setUser(response);
          return response;
        })
      );
    }

    return this.userObserver;
  }

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>('v1/self').pipe(
      debounceTime(100),
      share()
    );
  }

  public clearToken() {
    this.authenticatedUser = undefined;
    this.memoryToken = this.generateDefaultObject();
    this.storage.removeItem('token');
  }

  public authenticate(email: string, password: string): Observable<ITokenResponse> {

    return this.http.post<ITokenResponse>(`v1/authenticate`, {
      email,
      password
    }).pipe(
      tap(response => this.setTokenResponse(response))
    );
  }

  public authenticatePassword(email: string, password: string): Observable<any> { 
  
    return this.http.post<any>(`v1/authenticate/validate-password`,{
      email,
      password
    });
  
  }

  public logout(refreshToken: string): Observable<any> {
    return this.http.post(`v1/logout`, {
      refreshToken
    });
  }

  public passwordReset(email: string): Observable<any> {
    return this.http.post(`v1/password-reset`, {
      email
    });
  }

  public passwordResetConfirm(newPassword: string, token: string) {
    return this.http.post(`v1/password-reset/confirm`, {
      newPassword,
      token
    });
  }

  /**
   * Atualização de senha.
   *
   * @param newPassword string
   * @param password string
   */
  public updatePassword(newPassword: string, password: string) {
    return this.http.put(`v1/self/update-password`, {
      newPassword,
      password
    });
  }

  /**
   * Atualização de usuário (PATCH)
   *
   * @param first_name string
   * @param last_name string
   * @param birthday string
   */
  public patchUser(first_name: string, last_name: string, birthday: string): Observable<IUser> {
    return this.http.patch<IUser>(`v1/self`, {
      first_name,
      last_name,
      birthday
    }).pipe(
      tap(response => this.setUser(response))
    );
  }

  /**
   * @important Utilizar este método para atribuir dados ao usuário. (Não permitir alteração do usuário fora deste escopo)
   * @param value IUser Objeto de usuário retornado pela api
   */
  private setUser(value: IUser) {
    this.authenticatedUser = value;
    this._onSetBirthday(value.birthday);
    this.subjectUser.next(this.authenticatedUser);
  }

  /**
   * Mutator for Birthday when use setUser
   */
  private _onSetBirthday(value: string) {
    this.authenticatedUser.birthday = moment(value).format('YYYY-MM-DD');
  }

  private generateDefaultObject(): ITokenResponse {
    return {
      token: null,
      refreshToken: null,
      type: null
    };
  }

  private onLoadToken(inputToken?: ITokenResponse) {
    const token = this.storage.getItem('token');
    if (inputToken) {
      this.memoryToken = inputToken;
    } else if (token) {
      this.memoryToken = JSON.parse(token);
    }
  }

  private setTokenResponse(tokenResponse: ITokenResponse) {
    try {
      const token: string = JSON.stringify(tokenResponse);
      this.storage.setItem('token', token);
      this.onLoadToken(tokenResponse);
    } catch (error) {
      console.error(`[AuthGuardService][setTokenResponse]`, error);
    }
  }
}
