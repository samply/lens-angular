import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleResultRendererComponent } from './single-result-renderer.component';
import { SingleResultRendererDirective } from './single-result-renderer.directive';



@NgModule({
  declarations: [
    SingleResultRendererComponent,
    SingleResultRendererDirective
  ],
  exports: [
    SingleResultRendererComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SingleResultRendererModule { }
