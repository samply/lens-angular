import { Injectable } from '@angular/core';
import { Measure, Stratifier } from '@samply/lens-core';

@Injectable({
  providedIn: 'root'
})
export class EucaimResultTransformerService {

  constructor() { }

  transform(results: Map<string, any>): Array<Measure>{
    const measures: Array<Measure> = [];
    const collections = [...results].map(([name, value]) => value).flatMap(value => value.collections);
    console.log(collections);
    measures.push(
      this.generateCollectionMeasure(collections)
    )
    return measures;
  }

  generateCollectionMeasure(collections: Array<any>): Measure {
    let measurePopulation = 0;
    const studiesStratifiers: {key: string, population: number}[] = []
    const subjectsStratifiers: {key: string, population: number}[] = []
    collections.forEach(collection => {
      measurePopulation += 1;
      studiesStratifiers.push({key: collection.name, population: collection.studies_count})
      subjectsStratifiers.push({key: collection.name, population: collection.subjects_count})
    })
    const studiesStratifier: Stratifier = new Stratifier(
      "studies",
      studiesStratifiers
    );
    const subjectsStratifier: Stratifier = new Stratifier(
      "subjects",
      subjectsStratifiers
    )
    return new Measure(
      "collections",
      measurePopulation,
      [
        studiesStratifier,
        subjectsStratifier
      ]
    )
  }
}
