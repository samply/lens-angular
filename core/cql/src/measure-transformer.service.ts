import {Injectable} from '@angular/core';
import { Measure, ResultTransformer, Stratifier } from '@samply/lens-core';

@Injectable({
  providedIn: 'root'
})
export class MeasureTransformerService implements ResultTransformer {

  public siteToDefaultCollectionId: Map<string, string> = new Map<string, string>()
    .set("dresden", "bbmri-eric:ID:DE_BBD:collection:DILB")
    .set("frankfurt", "bbmri-eric:ID:DE_iBDF:collection:UCT")
    .set("wuerzburg", "bbmri-eric:ID:DE_ibdw:collection:bc")
    .set("brno", "bbmri-eric:ID:CZ_MMCI:collection:LTS")
    .set("aachen", "bbmri-eric:ID:DE_RWTHCBMB:collection:RWTHCBMB_BC")
    .set("leipzig", "bbmri-eric:ID:DE_LMB:collection:LIFE")
    .set("muenchen-hmgu", "bbmri-eric:ID:DE_Helmholtz-MuenchenBiobank:collection:DE_KORA")
    .set("Pilsen", "bbmri-eric:ID:CZ_CUNI_PILS:collection:serum_plasma")
    .set("blaze", "something")

  constructor() {
  }

  transform(results: Map<string, any>): Array<Measure> {
    let measures: Array<Measure> = []
    let siteMeasure = new Measure("sites", 0, [])
    let patientsPerSite = new Stratifier(
      "patients",
      []
    )
    results.forEach((data, requestTarget) => {
      let siteMeasures: Array<Measure> = []
      if (data != undefined && data.group instanceof Array) {
        data.group.forEach((group: any) => {
          siteMeasures.push(this.transformToMeasure(group, requestTarget))
        })
      } else {
        console.log("Received empty dataset from site, adding empty measures for this site!")
        siteMeasures.push(new Measure("patients", 0, []))
        siteMeasures.push(new Measure("specimen", 0, []))
        siteMeasures.push(new Measure("procedures", 0, []))
      }
      // Merge with all existing measures!
      measures = this.mergeMeasures(measures, siteMeasures);
      // Add to sum of all sites that already responded!
      siteMeasure.value += 1;
      let siteStratifier = new Stratifier(
        requestTarget,
        []
      );
      patientsPerSite.stratum = patientsPerSite.stratum.concat({
        key: requestTarget,
        population: (data != undefined && data.group instanceof Array) ? data.group[0].population[0].count : 0
      })
      siteMeasures.forEach(measure => {
        siteStratifier.stratum.push({
          key: measure.key,
          population: measure.value
        })
      })
      siteMeasure.stratifier.push(siteStratifier);
    })
    siteMeasure.stratifier = siteMeasure.stratifier.concat(patientsPerSite);
    measures.push(siteMeasure)
    return measures;
  }

  private transformToMeasure(group: any, requestTarget: string): Measure {

    let measure = new Measure (
      group.code.text,
      group.population[0].count,
      []
    )
    for (let stratifierIndex = 0; stratifierIndex < group.stratifier.length; stratifierIndex++) {
      let title: string = group.stratifier[stratifierIndex].code[0].text
      let stratifier = new Stratifier(
        title,
        []
      )

      if(group.stratifier[stratifierIndex].stratum === undefined) {
        continue
      }

      for (let stratumIndex = 0; stratumIndex < group.stratifier[stratifierIndex].stratum.length; stratumIndex++){
        let key: string = group.stratifier[stratifierIndex].stratum[stratumIndex].value.text
        if ((title == "Custodian") && (key == "null")){
          // @ts-ignore
          key = this.siteToDefaultCollectionId.get(requestTarget);
          //there's gonna be duplicates, we'll deal with them later

        }
        stratifier.stratum = stratifier.stratum.concat({
          key: key,
          population: group.stratifier[stratifierIndex].stratum[stratumIndex].population[0].count
        })
      }
      measure.stratifier = measure.stratifier.concat(stratifier)
    }

    return measure;
  }

  public mergeMeasures(measures: Array<Measure>, siteMeasures: Array<Measure>): Array<Measure>{
    let mergedMeasures: Array<Measure> = measures;
    siteMeasures.forEach(transformedMeasure => {
      let previousMeasureIndex = measures.findIndex(measure => measure.key == transformedMeasure.key);
      if (previousMeasureIndex > -1) {
        let mergedMeasure = measures[previousMeasureIndex];
        mergedMeasure.value += transformedMeasure.value;
        transformedMeasure.stratifier.forEach(transformedStratifier => {
          let previousStratifierIndex = mergedMeasure.stratifier.findIndex(stratifier => stratifier.key == transformedStratifier.key)
          if (previousStratifierIndex > -1) {
            let mergedStratifier = mergedMeasure.stratifier[previousStratifierIndex];
            transformedStratifier.stratum.forEach(transformedStratum => {
              let previousStratumIndex = mergedStratifier.stratum.findIndex(stratum => stratum.key == transformedStratum.key);
              if (previousStratumIndex > -1) {
                let mergedStratum = mergedStratifier.stratum[previousStratumIndex]
                mergedStratum.population += transformedStratum.population;
                mergedStratifier.stratum[previousStratumIndex] = mergedStratum
              } else {
                mergedStratifier.stratum.push(transformedStratum)
              }
            })
            mergedMeasure.stratifier[previousStratifierIndex] = mergedStratifier
          } else {
            mergedMeasure.stratifier.push(transformedStratifier);
          }
        })
        mergedMeasures[previousMeasureIndex] = mergedMeasure;
      } else {
        mergedMeasures.push(transformedMeasure)
      }
    })
    return mergedMeasures;
  }
}
