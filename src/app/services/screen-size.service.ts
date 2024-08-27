import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private screenWidth$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private resizeObserver!: ResizeObserver;

  init(): void {
    this.screenWidth$.next(window.innerWidth);

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.screenWidth$.next(entry.contentRect.width);
      }
    });
    this.resizeObserver.observe(document.body);
  }

  getScreenWidthObservable(): BehaviorSubject<number> {
    return this.screenWidth$;
  }
}
