import { DatePipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { Movie } from 'src/app/core/modules/movie.module';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';
import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let debugElement: DebugElement;

  const mockMovie: Movie = {
    id: 1,
    title: 'Mock Movie',
    poster_path: '/mock-poster-path.jpg',
    vote_average: 8.5,
    release_date: '2024-09-01',
    overview: 'This is a mock movie description.',
    adult: false,
    backdrop_path: '',
    genre_ids: [],
    original_language: '',
    original_title: '',
    popularity: 0,
    video: false,
    vote_count: 0
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatTooltipModule,
        LoadingSpinnerModule,
        DatePipe,
        MovieCardComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set posterUrl correctly', () => {
    expect(component.posterUrl).toBe(
      'https://image.tmdb.org/t/p/w500/mock-poster-path.jpg'
    );
  });

  it('should calculate percentageScore correctly', () => {
    expect(component.percentageScore).toBe(85);
  });

  it('should set loading$ to false after finishLoading', (done) => {
    component.finishLoading();
    fixture.detectChanges();

    component.loading$.subscribe((loading) => {
      if (!loading) {
        expect(loading).toBeFalse();
        done();
      }
    });
  });

  it('should display the movie title', () => {
    const titleElement = debugElement.query(By.css('.movie-title')).nativeElement;
    console.log(debugElement.query(By.css('.movie-title')).nativeElement);
    expect(titleElement.textContent).toContain('Mock Movie');
  });

  it('should display the poster image', () => {
    const imgElement = debugElement.query(By.css('img')).nativeElement;
    expect(imgElement.src).toContain(component.posterUrl);
  });
});
