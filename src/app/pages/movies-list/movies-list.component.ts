import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, first, takeUntil } from 'rxjs';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { DestroyEventNoticeComponent } from 'src/app/shared/extensions/destroy-event-notice.component';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent extends DestroyEventNoticeComponent implements OnInit {
  selectedCategory: number = 1;

  categories = CategoriesEnum;

  categoryIds = ['TRENDING', 'POPULAR', 'FREE'];

  langStrings: any = {};
  langStringsFetchAttempts = 0;
  langStringMaxFetchAttempts = 3;

  constructor(
    protected screenSizeService: ScreenSizeService,
    protected translate: TranslateService,
    protected router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (_: any) => {
        this.fetchLanguageStrings();
      }
    });

    this.router.events.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          const queryParams = this.router.parseUrl(this.router.url).queryParams;

          if (queryParams['category'] && parseInt(queryParams['category']) !== this.selectedCategory) {
            this.selectCategory(parseInt(queryParams['category']));
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
            setTimeout((_: any) => {
              this.langStringsFetchAttempts++;
              this.fetchLanguageStrings();
            }, 1000);
          }
        }
      }
    });
  }

  getCurrentCategoryName(): string {
    switch (this.selectedCategory) {
      case CategoriesEnum.TRENDING: {
        return (this.langStrings['CATEGORIES'] as any)?.['TRENDING'];
      }
      case CategoriesEnum.POPULAR: {
        return (this.langStrings['CATEGORIES'] as any)?.['POPULAR'];
      }
      case CategoriesEnum.FREE: {
        return (this.langStrings['CATEGORIES'] as any)?.['FREE'];
      }
    }

    return '';
  }

  selectCategory(category: number) {
    this.selectedCategory = category;

    let url = this.router.url.split('?')[0];
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    queryParams['category'] = category;

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

}

enum CategoriesEnum {
  TRENDING = 1,
  POPULAR = 2,
  FREE = 3
}
