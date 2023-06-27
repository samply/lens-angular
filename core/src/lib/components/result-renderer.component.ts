import { Component, OnInit } from '@angular/core';
import { Condition } from '../model/condition';
import { Measure, Stratifier } from '../model/measure';
import { Operation } from '../model/operation';
import { ResultRenderer } from '../model/result-renderer';
import { CatalogueService } from '../services/catalogue.service';
import { QueryService } from '../services/query.service';

/*
* Base Component for ResultRenderers. It fetches a list of results and applies defined headers, aggregations and sorts on the data.
*/
@Component({
  template: ``,
  styles: []
})
export class ResultRendererComponent implements OnInit {

  currentCondition!: Condition

  protected results: {key: string, population: number}[] = [];

  constructor(
    protected queryService: QueryService,
    private catalogueService: CatalogueService,
    protected resultRenderer: ResultRenderer,
  ) {
  }

  ngOnInit(): void {
    this.queryService.query$.subscribe(value => {
      if (this.resultRenderer.results[0] == undefined) {
        console.warn(`Didn't receive proper definition for Bar Chart ${this.resultRenderer.title}. Please check your result-viewer configuration.`)
      } else {
        if (!this.resultRenderer.clickDisabled) {
          this.displayPreviousCondition();
        }
      }
    })
    this.queryService.transformedResults$.subscribe(data => {
      // guarantee that upon receiving new data, it will display
      this.handleUpdatedData(data);
    })
  }

  /*
  * Defines how new data is processed. To extend processing, specialized components can override the functionality.
  * */
  protected handleUpdatedData(measures: Measure[]) {
    this.results = [];
    this.resultRenderer.results.forEach(result => {
      let measure = measures.find(measure => measure.key == result.key);
      let stratifiers: Array<Stratifier> = [];
      if (result.subset != undefined && result.subset === "*") {
        let foundStratifiers = measure?.stratifier ;
        if (foundStratifiers != undefined) {
          stratifiers = foundStratifiers;
        }
      } else if (result.subset != undefined) {
        let foundStratifier = measure?.findStratifier(result.subset);
        if (foundStratifier != undefined){
          stratifiers.push(foundStratifier)
        }
      }
      if (stratifiers.length != 0) {
        stratifiers.forEach(stratifier => {
          this.results = this.computeNewData(stratifier.stratum)
        });
      } else if (measure != undefined && measure.value > 0) {
        let measureAsStratifier = [{key: measure.key, population: measure.value}];
        this.results = this.results.concat(this.computeNewData(measureAsStratifier))
      } else {
        this.results = this.results.concat(this.emptyResultData(result));
      }
    })

  }

  /* Returns an emptyResultDataSet based on the expected result. */
  protected emptyResultData(result: {key: string, subset?: string}) {
    return (result.subset != undefined) ?
        {key: result.subset, population: 0} :
        {key: result.key, population: 0}
  }

  /* Returns whether the current chart is empty.*/
  protected isEmpty() {
    return this.results.every(result => result.population == 0);
  }

  private computeNewData(values: {key: string, population: number}[]): {key: string, population: number}[] {
    let aggregation = this.applyAggregators(values);
    let sorted = this.applySorting(aggregation)
    return this.applyHeaders(sorted);
  }

  private applyAggregators(data: {key: string, population: number}[]): {key: string, population: number}[] {
    let aggregatedData = data;
    for (let i = 0; i < this.resultRenderer.aggregators.length; i++){
      aggregatedData = this.resultRenderer.aggregators[i](aggregatedData)
    }
    return aggregatedData;
  }

  private applySorting(data: {key:string, population: number}[]): {key:string, population: number}[] {
    let sortedData = data;
    for (let i = 0; i < this.resultRenderer.sorters.length; i++) {
      sortedData = sortedData.sort(this.resultRenderer.sorters[i])
    }
    return sortedData;
  }

  private applyHeaders(values: {key: string, population: number}[]): {key: string, population: number}[]{
    return values.map(value => {
      return (this.resultRenderer.headers.has(value.key)) ?
        {key: this.resultRenderer.headers.get(value.key)!, population: value.population}
        : value
    })
  }

  protected displayPreviousCondition() {
    let formerValue = this.queryService.read((this.resultRenderer.results[0].subset) ? this.resultRenderer.results[0].subset?.toLowerCase() : this.resultRenderer.results[0].key.toLowerCase())
    if (formerValue != undefined && formerValue instanceof Condition) {
      this.currentCondition = formerValue;
    } else {
      let criteria = this.catalogueService.getCriteria((this.resultRenderer.results[0].subset) ? this.resultRenderer.results[0].subset?.toLowerCase() : this.resultRenderer.results[0].key.toLowerCase())
      this.currentCondition = new Condition(
        criteria.key,
        criteria.allowedConditionTypes[0],
        criteria.system,
      )
    }
  }

  onDataSelected(event: any) {
    if (!this.resultRenderer.clickDisabled) {
      let newCondition: Condition | Operation = this.currentCondition;
      let existingCondition = this.queryService.read(this.currentCondition.key);
      let newValue = this.unmapHeader(this.results[event.element.index].key);
      let criteria = this.catalogueService.getCriteria((this.resultRenderer.results[0].subset) ? this.resultRenderer.results[0].subset?.toLowerCase() : this.resultRenderer.results[0].key.toLowerCase())
      switch (criteria.type) {
        case "string":
          if (newCondition.type == "IN") {
            let currentValues = (newCondition.value instanceof Array<string>) ? newCondition.value : []
            let elementIndex = currentValues.findIndex(element => {
              return element == newValue
            });
            if (elementIndex == -1) {
              newCondition.value = [...currentValues, newValue]
            } else {
              newCondition.value = currentValues.filter(element => {
                return element != newValue;
              })
            }
          } else if (existingCondition instanceof Operation) {
            newCondition = existingCondition;
            let childIndex = existingCondition.children.findIndex(child => (<Condition> child).value === newValue)
            if (childIndex != -1) {
              newCondition.children = existingCondition.children.filter(child => (<Condition> child).value !== newValue)
            } else {
              newCondition.children = [...existingCondition.children, new Condition(
                criteria.key,
                ((<string>newValue).indexOf("%") != -1) ? "CONTAINS" : "EQUALS",
                criteria.system,
                newValue
              )]
            }
          } else {
            newCondition.value = (newCondition.value === newValue) ? "" : newValue;
            newCondition.type = ((<string>newValue).indexOf("%") != -1) ? "CONTAINS" : "EQUALS";
          }
          break;
        default:
          console.warn(`It is currently not implemented to create conditions for ${criteria.type} criteria from charts. Please implement the feature yourself or disable the click with the 'clickDisabled' flag.`)
          break;
      }
      // Determine what todo with the condition
      if (newCondition.isEmpty()) {
        this.queryService.delete(newCondition);
      } else if (existingCondition == undefined || existingCondition.isEmpty()) {
        this.queryService.create(newCondition)
      } else {
        this.queryService.update(newCondition)
      }
    }
  }

  /* unmap a header to it's original value. will return the input if no header mapping is detected*/
  private unmapHeader(header: string): string {
    for (let [key, value] of this.resultRenderer.headers.entries()) {
      if (value === header) {
        return key;
      }
    }
    return header;
  }

}
