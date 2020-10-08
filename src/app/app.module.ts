import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PreGameFullComponent } from './components/pre-game-full/pre-game-full.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutGamesComponent } from './components/layout-games/layout-games.component';
import localePt from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common';
import { RouterService } from './services/router.service';
import { MaterialModule } from './material.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { QRCodeModule } from 'angularx-qrcode';
import { TextMaskModule } from 'angular2-text-mask';


import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ResultGamesComponent } from './components/result-games/result-games.component';


registerLocaleData(localePt, 'pt-BR');

const IMPORTS = [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, BrowserAnimationsModule];
const COMPONENT_DECLARRATIONS = [PreGameFullComponent, LayoutGamesComponent ];

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
     RouterService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
