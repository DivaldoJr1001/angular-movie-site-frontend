import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from './language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    LanguageSelectorComponent
  ]
})
export class LanguageSelectorModule { }
