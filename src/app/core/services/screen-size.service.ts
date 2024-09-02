import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private screenWidth$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private resizeObserver!: ResizeObserver;

  private headerHeight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private footerHeight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  init(options: { headerHeight?: number, footerHeight?: number} = {}): void {
    this.screenWidth$.next(window.innerWidth);

    if (options && options.headerHeight) {
      this.headerHeight$.next(options.headerHeight);
    }

    if (options && options.footerHeight) {
      this.footerHeight$.next(options.footerHeight);
    }

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.screenWidth$.next(entry.contentRect.width);
      }
    });
    this.resizeObserver.observe(document.body);
  }

  getScreenWidthObservable(): BehaviorSubject<number> {
    return this.screenWidth$;
  }

  getHeaderHeightObservable(): BehaviorSubject<number> {
    return this.headerHeight$;
  }

  setHeaderHeight(height: number): void {
    this.headerHeight$.next(height);
  }

  getFooterHeightObservable(): BehaviorSubject<number> {
    return this.footerHeight$;
  }

  setFooterHeight(height: number): void {
    this.footerHeight$.next(height);
  }

  getBodyViewHeightPx(): string {
    return `${window.innerHeight - this.headerHeight$.value - this.footerHeight$.value}px`;
  }
}
