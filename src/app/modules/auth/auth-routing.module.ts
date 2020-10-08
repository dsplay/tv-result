import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordComponent } from './password/password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordResolverService } from './services/reset-password-resolver.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackResolverService } from './services/feedback-resolver.service';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'password', component: PasswordComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent,
    resolve: {
      token: ResetPasswordResolverService
    }
  },
  {
    path: 'feedback', component: FeedbackComponent,
    resolve: {
      type: FeedbackResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
