import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ResultRendererComponent } from './components/result-renderer.component';
import { SearchHighlightPipe } from "./pipes/search-highlight.pipe";
import { ChipTransformPipe } from "./pipes/chip-transform.pipe";
import { LensConfig, LENS_CONFIG_TOKEN } from './lens-config';



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
export class LensCoreModule {

  public static forRoot(config: LensConfig): ModuleWithProviders<LensCoreModule> {
    return {
      ngModule: LensCoreModule,
      providers: [
        {
          provide: LENS_CONFIG_TOKEN,
          useValue: config
        }
      ]
    };
  }

}
