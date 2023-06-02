import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarComponent } from './loading-bar.component';
import {ProgressBarModule} from "primeng/progressbar";


@NgModule({
  declarations: [
    LoadingBarComponent
  ],
  exports: [
    LoadingBarComponent
  ],
  imports: [
    CommonModule,
    ProgressBarModule,
  ]
})
export class LoadingBarModule { }
