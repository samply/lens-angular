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
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const key = context[0].label || '';
              let result = (this.resultRenderer.tooltips.get(key))
                ? this.resultRenderer.tooltips.get(key) : key;
              return result
            }
          }
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
          },
          ticks: {
            callback: (val) => {
              if (typeof val === 'string') return val.toString()
              const key: unknown = (this.chartData.labels)
                ? this.chartData.labels[val] : val.toString();
              if (typeof key !== 'string') return val.toString()
              let result = (this.resultRenderer.headers.get(key))
                ? this.resultRenderer.headers.get(key) : key;
              return result
            }
          }
        }
      },
    }
  }
}
