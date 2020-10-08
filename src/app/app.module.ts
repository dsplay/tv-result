import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PreGameFullComponent } from './components/pre-game-full/pre-game-full.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LayoutGamesComponent } from './components/layout-games/layout-games.component';
import { MenuSportTournamentsComponent } from './components/menu-sport-tournaments/menu-sport-tournaments.component';
import localePt from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common';
import { PreMakeBetComponent } from './components/pre-make-bet/pre-make-bet.component';
import { PreGameDetailComponent } from './components/pre-game-detail/pre-game-detail.component';
import { RouterService } from './services/router.service';
import { MaterialModule } from './material.module';
import { BetIntentionComponent } from './components/bet-intention/bet-intention.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { QRCodeModule } from 'angularx-qrcode';
import { DialogHelperComponent } from './components/dialog-helper/dialog-helper.component';
import { TableHelperRatesComponent } from './components/table-helper-rates/table-helper-rates.component';
import { DialogJustOneDayComponent } from './components/dialog-just-one-day/dialog-just-one-day.component';
import { DialogCheckBetComponent } from './components/dialog-check-bet/dialog-check-bet.component';
import { TextMaskModule } from 'angular2-text-mask';






import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharedModule } from './modules/shared/shared.module';
import { ResultGamesComponent } from './components/result-games/result-games.component';


registerLocaleData(localePt, 'pt-BR');

const IMPORTS = [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, BrowserAnimationsModule, SharedModule];
const COMPONENT_DECLARRATIONS = [PreGameFullComponent, LayoutGamesComponent,
  MenuSportTournamentsComponent, PreMakeBetComponent, PreGameDetailComponent, DialogCheckBetComponent,
  BetIntentionComponent, DialogHelperComponent, TableHelperRatesComponent, DialogJustOneDayComponent ];

@NgModule({
  declarations: [
    AppComponent,
    COMPONENT_DECLARRATIONS,
    ResultGamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    IMPORTS,
    BrowserAnimationsModule,
    MaterialModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ShareButtonsModule,
    ShareIconsModule,
    TextMaskModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }, RouterService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
