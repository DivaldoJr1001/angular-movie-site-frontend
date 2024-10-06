import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MovieApiService } from '../api/movie-api.service';

@Injectable({
  providedIn: 'root'
})
export class GenresDataService {

  private genresSubject = new BehaviorSubject<{ id: number, name: string }[]>([]);
  genres$ = this.genresSubject.asObservable();
  private genreCache: Record<string, { id: number, name: string }[]> = {};

  constructor(
    private movieApiService: MovieApiService,
    private translateService: TranslateService
  ) {
    this.initializeGenres();
  }

  private initializeGenres(): void {
    this.translateService.onLangChange
      .pipe(
        switchMap(langChange => this.getGenresForLanguage(langChange.lang))
      )
      .subscribe(genres => {
        this.genresSubject.next(genres);
      });
  }

  private getGenresForLanguage(language: string): Observable<{
    id: number;
    name: string;
  }[]> {
    if (this.genreCache[language]) {
      return new BehaviorSubject(this.genreCache[language]).asObservable();
    } else {
      return this.movieApiService.getGenres(language).pipe(
        switchMap(response => {
          this.genreCache[language] = response.genres;
          return new BehaviorSubject(response.genres).asObservable();
        })
      );
    }
  }

  getGenreNamesByIds(genreIds: number[]): string[] {
    const currentLanguage = this.translateService.currentLang;
    const genres = this.genreCache[currentLanguage] || [];

    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : 'Unknown';
    });
  }
}
