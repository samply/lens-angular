import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ChartJsComponent } from "./chart-js.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [
    ChartJsComponent,
    BarChartComponent,
    PieChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ChartModule
  ],
  exports: [
    ChartJsComponent,
    BarChartComponent,
    PieChartComponent,
    LineChartComponent
  ]
})
export class ChartJsModule { }
