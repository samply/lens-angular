import { Type } from "@angular/core"
import { ResultRendererComponent } from "../components/result-renderer.component";

/*
  Defines how specific datasets should be visualized.
 */
export class ResultRenderer {

  /* title of the results in the ui */
  public readonly title: string;
  /* list of results that should be displayed by this instance */
  public readonly results: Array<{key: string, subset?: string}>;
  /* component used to display the results */
  public readonly component: Type<ResultRendererComponent>
  /* adjusts the main axis used by a chart. Only supported by bar and pie chart. */
  public readonly indexAxis: 'x' | 'y' = 'x';
  /* adjusts wether to display a legend below the chart. Only supported by bar and pie chart. */
  public readonly displayLegend: boolean = true;
  /* meta-data used for the display of the diagrams. Only used by result-renderer grid.*/
  public readonly displayProperties: string[] = [];
  /* deactivates the addition of conditions then clicking on a chart */
  public readonly clickDisabled: boolean = false;
  /* alternative labels for the keys of the data */
  public readonly headers: Map<string, string> = new Map<string, string>();
  /* list of strings that add information for the user */
  public readonly hints: Array<string> = [];
  /* a list of custom functions used to further aggregate the data */
  public readonly aggregators: Array<(values: Array<{key: string, population: number}>) => Array<{key: string, population: number}>> = [];
  /* a list of custom functions used to sort the data */
  public readonly sorters: Array<(a: {key: string, population: number}, b: {key: string, population: number}) => number> = []
  /* Title for x-axis */
  public readonly xAxisTitle: string = "";
  /* Title for y-axis */
  public readonly yAxisTitle: string = "";
  /* Primarycolors for this diagram */
  public readonly primaryColors: string[] = [
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
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
  /* HoverColors for this diagrams */
  public readonly hoverColors: string[] = [
    "#64B5F6",
    "#81C784",
    "#FFB74D",
    "#8000A0",
    "#AB5236",
    "#FF004D",
    "#ffec27",
    "#83769c",
    "#ff77a8",
    "#29aeff",
    "#80ff00",
    "#ff5600"
  ];
  public readonly showNegotiationButton: boolean = false;
  public readonly showOn: Array<string> = [];
  public readonly dontShowOn: Array<string> = [];

  constructor(
    title: string,
    results: Array<{key: string, subset?: string}>,
    component: Type<ResultRendererComponent>,
    options: {
      indexAxis?: 'x' | 'y'
      displayLegend?: boolean
      headers?: Map<string, string>
      clickDisabled?: boolean
      displayProperties?: string[]
      hints?: Array<string>
      aggregators?: Array<(values: Array<{ key: string, population: number }>) => Array<{ key: string, population: number }>>
      sorters?: Array<(a: { key: string, population: number }, b: { key: string, population: number }) => number>
      xAxisTitle?: string
      yAxisTitle?: string
      primaryColors?: string[]
      hoverColors?: string[],
      showNegotiationButton?: boolean
      showOn?: Array<string>
      dontShowOn?: Array<string>
    } = { },
  ) {
    this.title = title;
    this.results = results;
    this.component = component;
    if (options.indexAxis != undefined)
      this.indexAxis = options.indexAxis
    if (options.displayLegend != undefined)
      this.displayLegend = options.displayLegend
    if (options.displayProperties != undefined)
      this.displayProperties = options.displayProperties
    if (options.clickDisabled != undefined)
      this.clickDisabled = options.clickDisabled
    if (options.headers != undefined)
      this.headers = options.headers
    if (options.aggregators != undefined)
      this.aggregators = options.aggregators
    if (options.sorters != undefined)
      this.sorters = options.sorters
    if(options.xAxisTitle != undefined)
      this.xAxisTitle = options.xAxisTitle
    if(options.yAxisTitle != undefined)
      this.yAxisTitle = options.yAxisTitle
    if(options.primaryColors != undefined)
      this.primaryColors = options.primaryColors
    if(options.hoverColors != undefined)
      this.hoverColors = options.hoverColors
    if(options.hints != undefined)
      this.hints = options.hints
    if(options.showNegotiationButton != undefined)
      this.showNegotiationButton = options.showNegotiationButton
    if(options.showOn != undefined)
      this.showOn = options.showOn
    if(options.dontShowOn != undefined)
      this.dontShowOn = options.dontShowOn
  }
}
