import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class DestroyEventNoticeComponent implements OnDestroy {
  _onDestroy = new Subject<void>();

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
