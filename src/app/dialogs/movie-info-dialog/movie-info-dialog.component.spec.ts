import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MovieInfoDialogComponent } from './movie-info-dialog.component';
import { GenresDataService } from 'src/app/core/services/genres-data.service';
import { Movie } from 'src/app/core/modules/movie.module';

describe('MovieInfoDialogComponent', () => {
  let component: MovieInfoDialogComponent;
  let fixture: ComponentFixture<MovieInfoDialogComponent>;
  let mockGenresDataService: jasmine.SpyObj<GenresDataService>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre_ids: [28, 878],
    overview: 'A mind-bending thriller.',
    release_date: '2010-07-16',
    vote_average: 8.8,
    vote_count: 10000,
    adult: false,
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    original_language: 'en',
    original_title: 'Inception',
    popularity: 29.78,
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    video: false
  };

  beforeEach(async () => {
    mockGenresDataService = jasmine.createSpyObj('GenresDataService', ['getGenreNamesByIds']);
    mockGenresDataService.getGenreNamesByIds.and.returnValue(['Action', 'Science Fiction']);

    await TestBed.configureTestingModule({
      imports: [
        MovieInfoDialogComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMovie },
        { provide: GenresDataService, useValue: mockGenresDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.data = { ...mockMovie };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load genres on init', () => {
    expect(mockGenresDataService.getGenreNamesByIds).toHaveBeenCalledWith(mockMovie.genre_ids);
    expect(component.movieGenres).toEqual(['Action', 'Science Fiction']);
  });

  it('should return a comma-separated genre string with capitalized words', () => {
    const genreString = component.getGenresString();
    expect(genreString).toBe('Action, Science Fiction');
  });

  it('should calculate and return the correct vote average as a percentage', () => {
    component.data.vote_count = 10000;
    component.data.vote_average = 8.8;
    const voteAverage = component.getVotesAverage();
    expect(voteAverage).toBe('88%');
  });

  it('should return "0%" if there are no votes', () => {
    component.data.vote_count = 0;
    const voteAverage = component.getVotesAverage();
    expect(voteAverage).toBe('0%');
  });

  it('should capitalize words correctly', () => {
    const capitalized = component['capitalizeWords']('science fiction');
    expect(capitalized).toBe('Science Fiction');
  });
});
