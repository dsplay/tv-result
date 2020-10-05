import { Component } from '@angular/core';
import { AuthGuardService } from '../../auth/services/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {

  constructor(private authGuard: AuthGuardService, private router: Router) { }

  public get isAuth(): boolean {
    return this.authGuard.isAuthenticated;
  }

  public logout() {
    const refreshToken = this.authGuard.refreshToken;
    this.authGuard.logout(refreshToken).subscribe(
      () => {
        this.authGuard.clearToken();
        this.router.navigate(['/']);
      }
    );
  }

}
