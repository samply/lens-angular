import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import {FormsModule} from "@angular/forms";
import {ChipsModule} from "primeng/chips";
import {AutoCompleteModule} from "primeng/autocomplete";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { LensCoreModule } from '@samply/lens-core';

@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChipsModule,
    AutoCompleteModule,
    PanelModule,
    ButtonModule,
    RippleModule,
    OverlayPanelModule,
    LensCoreModule
  ],
  exports: [
    SearchBarComponent
  ]
})
export class SearchBarModule { }
