import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  getHistoryBetsByDate(initDate: Date, endDate: Date, status: string ): Observable<any> {

    let params = `fromDate=${initDate.toISOString()}&toDate=${endDate.toISOString()}`;
    
    if (status) {

   params = params + `&status=${status}`;

    }

    return this.http.get(`v1/bet?${params}`);

  }

}
