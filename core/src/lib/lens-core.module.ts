import { NgModule } from '@angular/core';
import { ResultRendererComponent } from './components/result-renderer.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchHighlightPipe } from "./pipes/search-highlight.pipe";
import { ChipTransformPipe } from "./pipes/chip-transform.pipe";



@NgModule({
  declarations: [
    ResultRendererComponent,
    ChipTransformPipe,
    SearchHighlightPipe,
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    ResultRendererComponent,
    ChipTransformPipe,
    SearchHighlightPipe,
  ]
})
export class LensCoreModule { }
