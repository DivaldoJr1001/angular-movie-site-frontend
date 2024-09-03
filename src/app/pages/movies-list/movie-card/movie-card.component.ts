import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject } from 'rxjs';
import { Movie } from 'src/app/core/modules/movie.module';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    LoadingSpinnerModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  posterUrl!: string;

  percentageScore = 0;

  loading$ = new BehaviorSubject<boolean>(true);

  ngOnInit(): void {
    this.posterUrl = `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;

    this.percentageScore = Math.round(this.movie.vote_average * 10);
  }

  finishLoading(): void {
    setTimeout(() => {
      this.loading$.next(false);
    }, 200);
  }
}
