import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly format = `YYYY-MM-DD`;
  updateWallet = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  public register(data: IUser) {
    return this.http.post<IUser>(`v1/register`, this.middlewareUserRegister(data));
  }

  public confirm() {}

  private middlewareUserRegister(data: IUser) {
    /** Formata da usuário antes de realizar o submit */
    this.dateFormat(data);

    return data;
  }

  private dateFormat(data: IUser) {
    data.birthday = moment(data.birthday).format(this.format);
  }
}
