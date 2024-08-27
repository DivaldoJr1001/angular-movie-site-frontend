import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { envVariables } from 'src/environment/environment';
import { ScreenSizeService } from './services/screen-size.service';
import { DestroyEventNoticeComponent } from './shared/extensions/destroy-event-notice.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DestroyEventNoticeComponent implements OnInit {
  title = 'Angular Movie Database Application';

  loadingRouteConfig: boolean = false;

  constructor(
    protected translate: TranslateService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected screenSizeService: ScreenSizeService
  ) {
    translate.addLangs(['pt-BR', 'en-US']);
    super();
  }

  ngOnInit(): void {
    this.screenSizeService.init();

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        setTimeout((_: any) => {
          this.loadingRouteConfig = false;
          this.cd.detectChanges();
        }, 500);
      }
    });

    this.router.events.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (event: any) => {
        if (event instanceof NavigationEnd) {
          const availableLanguages = this.translate.getLangs();

          const language = this.activatedRoute.snapshot.queryParamMap.get('l') || '';

          if (!availableLanguages.includes(language)) {
            this.translate.use(this.translate.defaultLang);
          } else if (language !== this.translate.currentLang) {
            this.translate.use(language);
          }
        }
      }
    });

    this.translate.onLangChange.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (langObj: { lang: string }) => {
        let url = this.router.url.split('?')[0] + `?l=${langObj.lang}`;
        const queryParams = this.router.parseUrl(this.router.url).queryParams;

        for (const param of Object.keys(queryParams)) {
          if (param !== 'l') {
            url += `&${param}=${queryParams[param]}`;
          }
        }

        this.router.navigateByUrl(url);
      }
    });
  }

  openPortfolio(): void {
    const link = envVariables.portfolioLink;
    window.open(link + '?l=en-US', "_blank");
  }

  openGithub(): void {
    const link = envVariables.githubLink;
    window.open(link, "_blank");
  }

  openLinkedIn(): void {
    const link = envVariables.linkedInLink;
    window.open(link, "_blank");
  }
}
