import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, first, Observable, Subject, takeUntil } from 'rxjs';
import { MovieApiService } from 'src/app/core/api/movie-api.service';
import { emptyPaginatedMovies, PaginatedMovies } from 'src/app/core/modules/movie.module';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { DestroyEventNoticeComponent } from 'src/app/shared/extensions/destroy-event-notice.component';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent extends DestroyEventNoticeComponent implements OnInit {
  selectedCategory = 1;
  currentPage = 1;
  totalPages = 500;
  pageOptions: number[] = [];

  fetchPaginatedMoviesTrigger = new Subject<void>();

  paginatedMovies$ = new BehaviorSubject<PaginatedMovies>(emptyPaginatedMovies());
  loading$ = new BehaviorSubject<boolean>(true);

  categories = CategoriesEnum;

  categoryIds = ['TRENDING', 'POPULAR', 'FREE'];

  langStrings!: MoviesListLangStrings;
  langStringsFetchAttempts = 0;
  langStringMaxFetchAttempts = 3;

  subscriptionDebounceTime = 50;

  constructor(
    protected screenSizeService: ScreenSizeService,
    protected translate: TranslateService,
    protected router: Router,
    protected movieApiService: MovieApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchPaginatedMoviesTrigger.pipe(takeUntil(this._onDestroy), debounceTime(this.subscriptionDebounceTime)).subscribe({
      next: () => {
        this.fetchPaginatedMovies(this.currentPage);
      }
    });

    this.paginatedMovies$.pipe(takeUntil(this._onDestroy), debounceTime(this.subscriptionDebounceTime)).subscribe({
      next: paginatedMovies => {
        this.totalPages = paginatedMovies.total_pages < 500 ? paginatedMovies.total_pages : 500;
        this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }
    });

    this.translate.onLangChange.pipe(takeUntil(this._onDestroy)).subscribe({
      next: () => {
        this.fetchLanguageStrings();
        this.fetchPaginatedMoviesTrigger.next();
      }
    });

    this.router.events.pipe(takeUntil(this._onDestroy), debounceTime(50)).subscribe({
      next: (event) => {
        const scrollEvent = event as Scroll;
        if (event) {
          const queryParams = this.router.parseUrl(scrollEvent.routerEvent.url).queryParams;

          if (queryParams['category'] && parseInt(queryParams['category']) !== this.selectedCategory) {
            this.selectCategory(parseInt(queryParams['category']));
          }

          if (queryParams['page'] && parseInt(queryParams['page']) !== this.currentPage) {
            this.goToPage(parseInt(queryParams['page']));
          }
        }
      }
    });
  }

  fetchLanguageStrings(): void {
    this.translate.get('MOVIES_LIST').pipe(first()).subscribe({
      next: strings => {
        if (strings) {
          this.langStrings = strings;
          this.langStringsFetchAttempts = 0;
        } else {
          if (this.langStringMaxFetchAttempts < this.langStringMaxFetchAttempts) {
            setTimeout(() => {
              this.langStringsFetchAttempts++;
              this.fetchLanguageStrings();
            }, 200);
          }
        }
      }
    });
  }

  getCurrentCategoryName(): string {
    switch (this.selectedCategory) {
      case CategoriesEnum.TRENDING: {
        return this.langStrings.CATEGORIES?.TRENDING || '';
      }
      case CategoriesEnum.POPULAR: {
        return this.langStrings.CATEGORIES?.POPULAR || '';
      }
      case CategoriesEnum.FREE: {
        return this.langStrings.CATEGORIES?.FREE || '';
      }
    }

    return '';
  }

  selectCategory(category: number) {
    this.selectedCategory = category;

    this.triggerLoading();
    this.currentPage = 1;
    this.updateUrlWithParams();

    this.fetchPaginatedMoviesTrigger.next();
  }

  async fetchPaginatedMovies(page = 1): Promise<void> {
    this.loading$.next(true);

    if (this.currentPage !== page) {
      this.currentPage = page;
    }

    let fetchSource!: Observable<PaginatedMovies>;

    switch (this.selectedCategory) {
      case CategoriesEnum.TRENDING: {
        fetchSource = this.movieApiService.getTrendingMovies(page, this.translate.currentLang || this.translate.defaultLang).pipe(first());
        break;
      }
      case CategoriesEnum.POPULAR: {
        fetchSource = this.movieApiService.getPopularMovies(page, this.translate.currentLang || this.translate.defaultLang).pipe(first());
        break;
      }
      case CategoriesEnum.FREE: {
        fetchSource = this.movieApiService.getFreeMovies(page, this.translate.currentLang || this.translate.defaultLang).pipe(first());
        break;
      }
    }

    fetchSource.subscribe({
      next: paginatedMovies => {
        this.paginatedMovies$.next(paginatedMovies);
        this.finishLoading(200);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= 500) {
      this.triggerLoading();
      this.currentPage = page;
      this.updateUrlWithParams();

      this.fetchPaginatedMoviesTrigger.next();
    }
  }

  updateUrlWithParams(): void {
    let url = this.router.url.split('?')[0];
    const queryParams = this.router.parseUrl(this.router.url).queryParams;

    queryParams['category'] = this.selectedCategory;
    queryParams['page'] = this.currentPage;

    if (Object.keys(queryParams).length > 0) {
      url += '?';
    }

    Object.keys(queryParams).forEach((key, index) => {
      if (index > 0) {
        url += '&';
      }
      url += `${key}=${queryParams[key]}`;
    });

    this.router.navigateByUrl(url);
  }

  triggerLoading(): void {
    this.loading$.next(true);
  }

  finishLoading(delay = 0) {
    setTimeout(() => {
      this.loading$.next(false);
    }, delay);
  }
}

export enum CategoriesEnum {
  TRENDING = 1,
  POPULAR = 2,
  FREE = 3
}

export interface MoviesListLangStrings {
  'CATEGORIES'?: {
    'SELECT_CATEGORY'?: string,
    'TRENDING'?: string;
    'POPULAR'?: string;
    'FREE'?: string;
  },
  'EMPTY_LIST'?: string
}
