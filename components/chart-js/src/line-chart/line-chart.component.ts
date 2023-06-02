import { Component } from '@angular/core';
import {
  ResultRenderer,
  QueryService,
  CatalogueService
} from '@samply/lens-core';
import {ChartJsComponent} from "../chart-js.component";

@Component({
  selector: 'lens-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent extends ChartJsComponent {

  constructor(
    queryService: QueryService,
    catalogueService: CatalogueService,
    resultRenderer: ResultRenderer,
  ) {
    super(queryService, catalogueService, resultRenderer);
    this.primaryColors = resultRenderer.primaryColors;
    this.hoverColors = resultRenderer.hoverColors;
    this.chartOptions = {
      indexAxis: resultRenderer.indexAxis,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: resultRenderer.yAxisTitle
          }
        },
        x: {
          display: true,
          title: {
            display: true,
            text: resultRenderer.xAxisTitle
          }
        }
      }
    }
  }
}
