import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Movie } from 'src/app/core/modules/movie.module';
import { GenresDataService } from 'src/app/core/services/genres-data.service';

@Component({
  selector: 'app-movie-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './movie-info-dialog.component.html',
  styleUrl: './movie-info-dialog.component.scss'
})
export class MovieInfoDialogComponent implements OnInit {
  movieGenres: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Movie,
    private genresDataService: GenresDataService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.data.genre_ids.length > 0) {
      this.movieGenres = this.genresDataService.getGenreNamesByIds(this.data.genre_ids);
      this.cd.detectChanges();
    }
  }

  getGenresString(): string {
    return this.movieGenres
      .map(genre => this.capitalizeWords(genre))
      .join(', ');
  }

  private capitalizeWords(phrase: string): string {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getVotesAverage(): string {
    if (this.data.vote_count) {
      return Math.round(this.data.vote_average * 10) + '%';
    } else {
      return '0%';
    }
  }
}
