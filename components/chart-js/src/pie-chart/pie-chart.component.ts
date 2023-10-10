import {
  Component,
} from '@angular/core';
import {
  CatalogueService,
  QueryService,
  ResultRenderer
} from '@samply/lens-core';
import { ChartJsComponent } from "../chart-js.component";

/*
* Pie Chart Result Renderer based on ChardJS
* */
@Component({
  selector: 'lens-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent extends ChartJsComponent{
  constructor(
    queryService: QueryService,
    catalogueService: CatalogueService,
    resultRenderer: ResultRenderer,
  ) {
    super(queryService, catalogueService, resultRenderer)
    this.primaryColors = resultRenderer.primaryColors;
    this.hoverColors = resultRenderer.hoverColors;
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            generateLabels: (chart) => {
              if (chart.data === undefined) return []
              if (chart.data.labels === undefined) return []
              return chart.data.labels.map((l, i) => {
                if (typeof l !== 'string' || l === undefined) return {
                  datasetIndex: i,
                  text: "error"
                }
                let header = this.resultRenderer.headers.get(l);
                if (header === undefined) {
                  header = l
                }
                const labelColor = (this.isEmpty())
                  ? "#E6E6E6" : this.primaryColors[i]
                return {
                datasetIndex: i,
                text: header,
                fillStyle: labelColor,
                strokeStyle: labelColor,
              }})
            }
          }
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const key = context[0].label || '';
              const result = (this.resultRenderer.tooltips.get(key))
                ? this.resultRenderer.tooltips.get(key) : key;
              return result
            }
          }
        }
      }
    }
  }
}
