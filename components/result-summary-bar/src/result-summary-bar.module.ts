import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultSummaryBarComponent } from './result-summary-bar.component';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ChipModule} from "primeng/chip";
import { NegotiateButtonModule } from '@samply/lens-components/negotiate-button';


@NgModule({
  declarations: [
    ResultSummaryBarComponent
  ],
  exports: [
    ResultSummaryBarComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule,
    NegotiateButtonModule,
    ChipModule,
  ]
})
export class ResultSummaryBarModule { }
