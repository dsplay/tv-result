import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreGameFullComponent } from './components/pre-game-full/pre-game-full.component';
import { LayoutGamesComponent } from './components/layout-games/layout-games.component';
import { ResultGamesComponent } from './components/result-games/result-games.component';

const routes: Routes = [
  {
    path: '', component: LayoutGamesComponent,
    children: [
      { path: '', component: PreGameFullComponent },
      { path: 'tournament-result', component: ResultGamesComponent },
      // { path: 'event/:id', component: PreGameDetailComponent },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
