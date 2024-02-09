import {
  Component,
} from '@angular/core';
import {
  CatalogueService,
  ResultRenderer,
  QueryService,
} from '@samply/lens-core';
import {ChartJsComponent} from "../chart-js.component";

/*
* Bar Chart ResultRenderer based on ChartJS.
* */
@Component({
  selector: 'lens-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent extends ChartJsComponent{

  constructor(
    queryService: QueryService,
    catalogueService: CatalogueService,
    resultRenderer: ResultRenderer,
  ) {
    super(queryService, catalogueService, resultRenderer);
    this.primaryColors = resultRenderer.primaryColors.filter((color, index) => index == 0);
    this.hoverColors = resultRenderer.hoverColors.filter((color, index) => index == 0);
    this.chartOptions = {
      indexAxis: resultRenderer.indexAxis,
      maintainAspectRatio: false,
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
          },
          ticks: {
            precision: 0,
            autoSkip: false
          }
        },
        x: {
          display: true,
          title: {
            display: true,
            text: resultRenderer.xAxisTitle
          },
          ticks: {
            precision: 0,
            autoSkip: false
          }
        }
      }
    }
  }
}
