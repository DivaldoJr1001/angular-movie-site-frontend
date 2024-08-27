import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

  @Input() borderColor: string = 'black';
  @Input() updateBordersSubjectTrigger = new Subject<void>();
  @Input() forceCompactMode: boolean = false;
  @Input() compactScreenWidthThreshold: number = 0;
  compactMode: boolean = false;

  screenWidth!: number;
  resizeObserver!: ResizeObserver;

  bordersStyle: any = {};

  currentLanguage: string = '';
  defaultLanguage: string = 'pt-BR';
  languages: string[] = [];

  pathToFlags = '../../../../assets/flags';

  langStrings: { [key: string]: any } = {
    'pt-BR': {
      'LANGUAGE': 'Linguagem',
      'pt-BR': 'Português (Brasil)',
      'en-US': 'Inglês (EUA)'
    },
    'en-US': {
      'LANGUAGE': 'Language',
      'pt-BR': 'Portuguese (Brazil)',
      'en-US': 'English (USA)',
    }
  };

  constructor(
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) { }

  _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.languages = this.translate.getLangs();
    this.currentLanguage = this.translate.currentLang;

    this.translate.onLangChange.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (langObj: { lang: string }) => {
        if (this.currentLanguage !== langObj.lang) {
          this.currentLanguage = langObj.lang;
          this.cd.detectChanges();
        }
      }
    });

    this.screenWidth = window.innerWidth;

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.screenWidth = entry.contentRect.width;
        if (this.screenWidth < this.compactScreenWidthThreshold && !this.compactMode) {
          this.compactMode = true;
          this.cd.detectChanges();
        } else if (this.screenWidth >= this.compactScreenWidthThreshold && !!this.compactMode) {
          this.compactMode = false;
          this.cd.detectChanges();
        }
      }
    });
    this.resizeObserver.observe(document.body);

    this.updateBordersSubjectTrigger.pipe(takeUntil(this._onDestroy)).subscribe({
      next: _ => {
        this.updateBordersStyle();
      }
    });
    this.updateBordersSubjectTrigger.next();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  updateBordersStyle(): void {
    const b = '5px';
    const c = this.borderColor;
    const w = '20px';

    const g = `#0000 90deg, ${c} 0`;
    const p = `${w} ${w} border-box no-repeat`;

    this.bordersStyle = {
      'border': `${b} solid #0000`,
      'background': `
          conic-gradient(from 90deg at top ${b} left ${b}, ${g}) 0 0 / ${p},
          conic-gradient(from 180deg at top ${b} right ${b}, ${g}) 100% 0 / ${p},
          conic-gradient(from 0deg at bottom ${b} left ${b}, ${g}) 0 100% / ${p},
          conic-gradient(from -90deg at bottom ${b} right ${b}, ${g}) 100% 100% / ${p}
        `
    };
  }

  changeLanguage(lang: string): void {
    if (lang !== this.translate.currentLang) {
      this.translate.use(lang);
      this.currentLanguage = lang;
    }
  }
}
