import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MoviesListComponent } from './movies-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { LoadingSpinnerModule } from "../../shared/components/loading-spinner/loading-spinner.module";

@NgModule({
  declarations: [
    MoviesListComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MovieCardComponent,
    LoadingSpinnerModule
],
  exports: [
    MoviesListComponent
  ]
})
export class MoviesListModule { }
