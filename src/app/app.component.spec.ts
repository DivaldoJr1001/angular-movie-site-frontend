import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { envVariables } from 'src/environment/environment';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpLoaderFactory } from './app.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LanguageSelectorModule } from './shared/components/language-selector/language-selector.module';
import { MoviesListStandaloneComponent } from './pages/movies-list/movies-list.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        LanguageSelectorModule,
        MoviesListStandaloneComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend]
            },
            defaultLanguage: 'pt-BR'
        })],
    providers: [TranslateService, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('[Initialization] Should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`[Title] Should have as title 'Angular Movie Database Application'`, () => {
    expect(component.title).toEqual('Angular Movie Database Application');
  });

  it('[openPortfolio] Should call window.open with the correct URL', () => {
    spyOn(window, 'open');

    component.openPortfolio();

    expect(window.open).toHaveBeenCalledWith(envVariables.portfolioLink + '?l=pt-BR', '_blank');
  });

  it('[openLinkedIn] Should call window.open with the correct URL', () => {
    spyOn(window, 'open');

    component.openLinkedIn();

    expect(window.open).toHaveBeenCalledWith(envVariables.linkedInLink, '_blank');
  });

  it('[openGithub] Should call window.open with the correct URL', () => {
    spyOn(window, 'open');

    component.openGithub();

    expect(window.open).toHaveBeenCalledWith(envVariables.githubLink, '_blank');
  });
});
