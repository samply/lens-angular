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
        }
      }
    }
  }

}
