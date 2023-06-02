import { Component } from '@angular/core';
import { ChartData, ChartOptions } from "chart.js";
import {
  Measure,
  ResultRendererComponent
} from '@samply/lens-core';

const EMPTY_CHART_DATA: ChartData = {
  labels: ["", "", ""],
  datasets: [
    {data: [3, 1, 2]}
  ]
}

/*
* Implements basic interactions for ResultRenderers based on the ChartJS Library
* */
@Component({
  selector: 'lens-chart',
  template: ``,
})
export class ChartJsComponent extends ResultRendererComponent{


  protected chartData: ChartData = EMPTY_CHART_DATA;
  protected chartOptions: ChartOptions = {};

  protected primaryColors: string[] = [
    "#42A5F5",
    "#00a33a",
    "#e66831",
    "#800080",
    "#AB5236",
    "#FF004D",
    "#ffec27",
    "#83769c",
    "#ff77a8",
    "#29aeff",
    "#80ff00",
    "#ff5600"
  ];

  protected hoverColors: string[] = [
    "#64B5F6",
    "#00a33a",
    "#e66831",
    "#8000A0",
    "#AB5236",
    "#FF004D",
    "#ffec27",
    "#83769c",
    "#ff77a8",
    "#29aeff",
    "#80ff00",
    "#ff5600"
  ]

  private generateChartData(labels: string[], data: number[]): ChartData {
    return {
      labels: labels,
      datasets: [
        {
          label: "",
          data: data,
          backgroundColor: this.primaryColors,
          hoverBackgroundColor: this.hoverColors,
        }
      ]
    }
  }

  protected override handleUpdatedData(measures: Measure[]) {
    super.handleUpdatedData(measures);
    if (!this.isEmpty()) {
      this.chartData = this.generateChartData(
        this.results.map(result => result.key),
        this.results.map(result => result.population)
      )
    } else {
      this.chartData = EMPTY_CHART_DATA;
    }
  }

}
