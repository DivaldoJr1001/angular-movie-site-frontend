import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { envVariables } from 'src/environment/environment';
import { PaginatedMovies } from '../modules/movie.module';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {

  private apiKey = '';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {
    this.apiKey = envVariables.movieApiKey;
  }

  getPopularMovies(page: number, language: string): Observable<PaginatedMovies> {
    const url = `${this.baseUrl}/movie/popular`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);

    return this.http.get<PaginatedMovies>(url, { params });
  }

  getTrendingMovies(page: number, language: string): Observable<PaginatedMovies> {
    const url = `${this.baseUrl}/trending/movie/week`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);

    return this.http.get<PaginatedMovies>(url, { params });
  }

  getFreeMovies(page: number, language: string): Observable<PaginatedMovies> {
    const url = `${this.baseUrl}/discover/movie`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language)
      .set('with_watch_monetization_types', 'free');

    return this.http.get<PaginatedMovies>(url, { params });
  }
}
