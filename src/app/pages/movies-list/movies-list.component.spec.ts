import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MoviesListComponent } from './movies-list.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpBackend } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';
import { CommonModule } from '@angular/common';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MoviesListComponent
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [TranslateService]
    });
    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[Initialization] Should create page', () => {
    expect(component).toBeTruthy();
  });

  it('[fetchLanguageStrings] Should fetch the strings related to the page in the current language', fakeAsync(() => {
    component.fetchLanguageStrings();

    tick(2000);

    expect(!!Object.values(component.langStrings).length).toBeTruthy();
  }));

  it('[selectCategory] Should change selected category', () => {
    component.selectCategory(component.categories.POPULAR);

    expect(component.selectedCategory).toBe(component.categories.POPULAR)
  });

  it('[getCurrentCategoryName] Should fetch the name of the selected category in the current language', () => {
    component.fetchLanguageStrings();
    component.selectedCategory = component.categories.POPULAR;
    component.langStrings = {
      'CATEGORIES': {
        'POPULAR': 'Popular'
      }
    }
    expect(component.getCurrentCategoryName()).toBe((component.langStrings['CATEGORIES'] as any)?.['POPULAR']);
  });
});
