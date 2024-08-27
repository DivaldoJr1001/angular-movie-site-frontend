import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading-spinner.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [ LoadingSpinnerComponent ],
  imports: [
    MatProgressSpinnerModule
  ],
  exports: [ LoadingSpinnerComponent ]
})
export class LoadingSpinnerModule { }
