import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { EventType, Router, Scroll } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MovieApiService } from 'src/app/core/api/movie-api.service';
import { PaginatedMovies } from 'src/app/core/modules/movie.module';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';
import { CategoriesEnum, MoviesListStandaloneComponent } from './movies-list.component';

describe('MoviesListStandaloneComponent', () => {
  let component: MoviesListStandaloneComponent;
  let fixture: ComponentFixture<MoviesListStandaloneComponent>;
  let router: Router;

  const mockPaginatedMovies: PaginatedMovies = {
    results: [],
    page: 1,
    total_pages: 10,
    total_results: 200,
  };

  const urlSubject = new BehaviorSubject<string>('url');
  const mockRouterEvents = new Subject<Scroll>();

  const mockRouter = {
    events: mockRouterEvents,
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    parseUrl: jasmine.createSpy('parseUrl').and.callFake((url: string) => {
      const queryParams: Record<string, string> = {};

      const urlParts = url.split('?');

      if (urlParts.length > 1) {
        const params = urlParts[1].split('&');

        for (const param of params) {
          const paramParts = param.split('=');
          const name = paramParts[0];
          const value = paramParts[1];

          queryParams[name] = value;
        }
      }

      return { queryParams };
    }),
    get url(): string {
      return urlSubject.getValue();
    },
    set url(value: string) {
      urlSubject.next(value);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatMenuModule,
        MoviesListStandaloneComponent,
        MatPaginatorModule,
        LoadingSpinnerModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: Router, useValue: mockRouter
        },
        TranslateService,
        MovieApiService,
        ScreenSizeService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListStandaloneComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedCategory).toBe(1);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(500);
  });

  it('should fetch paginated movies on initialization', fakeAsync(() => {
    spyOn(component, 'fetchPaginatedMovies');
    component.ngOnInit();
    component.fetchPaginatedMoviesTrigger.next();

    tick(component.subscriptionDebounceTime);

    expect(component.fetchPaginatedMovies).toHaveBeenCalledWith(1);
  }));

  it('should update total pages and page options when paginatedMovies$ changes', fakeAsync(() => {
    component.ngOnInit();
    component.paginatedMovies$.next(mockPaginatedMovies);

    tick(component.subscriptionDebounceTime);

    fixture.detectChanges();
    expect(component.totalPages).toBe(10);
    expect(component.pageOptions.length).toBe(10);
  }));

  it('should update URL with category and page on category selection', () => {
    component.selectCategory(CategoriesEnum.POPULAR);

    expect(component.selectedCategory).toBe(CategoriesEnum.POPULAR);
    expect(component.currentPage).toBe(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching(/category=2&page=1/));
  });

  it('should update URL with current page on page navigation', () => {
    component.goToPage(5);

    expect(component.currentPage).toBe(5);
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching(/category=1&page=5/));
  });

  it('should update selectedCategory and currentPage based on URL params on Scroll event that triggers on first load', fakeAsync(() => {
    spyOn(component, 'selectCategory');
    spyOn(component, 'goToPage');

    const newUrl = '/?category=2&page=3';

    mockRouter.url = newUrl;
    mockRouterEvents.next(new Scroll({
      id: 0,
      url: newUrl,
      reason: '',
      code: 0,
      type: EventType.NavigationSkipped
    }, null, null));
    tick(component.subscriptionDebounceTime);
    discardPeriodicTasks();

    expect(component.selectCategory).toHaveBeenCalledWith(2, false);
    expect(component.goToPage).toHaveBeenCalledWith(3, false);
  }));

  it('should call fetchPaginatedMovies on category selection and page change', fakeAsync(() => {
    component.ngOnInit();

    spyOn(component, 'fetchPaginatedMovies');

    component.selectCategory(CategoriesEnum.FREE);
    tick(component.subscriptionDebounceTime * 2);
    expect(component.fetchPaginatedMovies).toHaveBeenCalledWith(1);

    component.goToPage(3);
    tick(component.subscriptionDebounceTime);
    expect(component.fetchPaginatedMovies).toHaveBeenCalledWith(3);
  }));
});
