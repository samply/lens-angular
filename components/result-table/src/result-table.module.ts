import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultTableComponent } from "./result-table.component";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { NegotiateButtonModule } from '@samply/lens-components/negotiate-button';



@NgModule({
  declarations: [
    ResultTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    NegotiateButtonModule
  ],
  exports: [
    ResultTableComponent
  ]
})
export class ResultTableModule {}
