import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultRendererGridComponent } from './result-renderer-grid.component';
import { ResultRendererGridDirective } from './result-renderer-grid.directive';



@NgModule({
  declarations: [
    ResultRendererGridComponent,
    ResultRendererGridDirective,
  ],
  exports: [
    ResultRendererGridComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ResultRendererGridModule { }
