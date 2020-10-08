import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../modules/auth/services/auth-guard.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthGuardService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;
    const type = this.auth.type;


    if (request.url.indexOf('gateway') > -1) {
      request = request.clone({});
    } else {
      if (this.auth.isAuthenticated) {
        const cloneRequest = {};

        const obj = {
          'Authorization': `${this.ucword(type)} ${token}`
        };

        Object.assign(cloneRequest, {
          headers: new HttpHeaders(obj)
        });

        request = request.clone(cloneRequest);
      }
    }


    return next.handle(request).pipe(
      tap(() => { },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.clearToken();
            this.router.navigate(['/auth/login']);
          }
        })
    );
  }

  private ucword(text: string) {
    let a = ``;

    for (let i = 0; i < text.length; i++) {
      if (i === 0) {
        a += text[i].toUpperCase();
      } else {
        a += text[i];
      }
    }

    return a;
  }
}

