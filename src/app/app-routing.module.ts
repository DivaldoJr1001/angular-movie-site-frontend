import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum Paths {
  MOVIES_LIST = ''
}

const routes: Routes = [
  {
    path: Paths.MOVIES_LIST,
    loadComponent: () => import('./pages/movies-list/movies-list.component').then((m) => m.MoviesListStandaloneComponent)
  },
  {path: '**', redirectTo: Paths.MOVIES_LIST, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
