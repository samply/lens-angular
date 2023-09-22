import { Component } from '@angular/core';
import {
  Measure,
  ResultRendererComponent
} from '@samply/lens-core';

/*
* A table specialized on displaying the amount of patients and specimen for each site.
* */
@Component({
  selector: 'lens-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css'],
})
export class ResultTableComponent extends ResultRendererComponent {

  public openRow(index: number) {
    document.querySelector(`.collapsable-wrapper-${index}`)?.classList.toggle('open')
    const button = document.querySelector(`.expand-button-${index}`)
    if (button?.classList.contains('pi-angle-down')){
      button.classList.remove('pi-angle-down')
      button.classList.add('pi-angle-up')
    } else {
      button?.classList.remove('pi-angle-up')
      button?.classList.add('pi-angle-down')
    }
  }

  public mockData = [
    {
    name: "Collection Name",
    id: "Collection ID",
    studies_count: 12,//<result of query>,
    subjects_count: 13,//<result_of_query>,
    age_range: {min:50 , max: 70},
    gender: ["male", "unknown"],
    modality: ["MRI", "PET-CT"],
    body_parts: ["RECTUM", "PROSTATE", "PELVIS"],
    description: "Short description of collection"
},
    {
    name: "Collection Name",
    id: "Collection ID",
    studies_count: 12,//<result of query>,
    subjects_count: 13,//<result_of_query>,
    age_range: {min:50 , max: 70},
    gender: ["male", "unknown"],
    modality: ["MRI", "PET-CT"],
    body_parts: ["RECTUM", "PROSTATE", "PELVIS"],
    description: "Short description of collection"
},
    {
    name: "Collection Name",
    id: "Collection ID",
    studies_count: 12,//<result of query>,
    subjects_count: 13,//<result_of_query>,
    age_range: {min:50 , max: 70},
    gender: ["male", "unknown"],
    modality: ["MRI", "PET-CT"],
    body_parts: ["RECTUM", "PROSTATE", "PELVIS"],
    description: "Short description of collection"
},
]
  public tableData: Array<{site: string, patients: number, samples: number, diagnosis: number}> = [];

  public selectedSites: Array<{site: string, patients: number, samples: number, diagnosis: number}> = [];

  protected override handleUpdatedData(measures: Measure[]) {
    // NOTE: This is not used here, we will refactor this later after adding different result-transformers
    // super.handleUpdatedData(measures);
    let sitesMeasure = measures.find(measure => measure.key == 'sites');
    if (sitesMeasure) {
      this.tableData = sitesMeasure.stratifier
        .filter(stratifier => stratifier.key != "patients")
        .map(site => {
          let patientStratum = site.stratum.find(strat => strat.key == "patients")
          let specimenStratum = site.stratum.find(strat => strat.key == "specimen")
          return {
            site: site.key,
            patients: (patientStratum != undefined) ? patientStratum.population : 0,
            samples: (specimenStratum != undefined) ? specimenStratum.population : 0,
            diagnosis: 0,
          }
        }).sort((a, b) => {
          return b.patients - a.patients
        })
    } else {
      this.tableData = []
    }
  }

  protected override displayPreviousCondition() {
    // Disable the loading of previous condition because user can't click the table
    // super.displayPreviousCondition();
  }

  onSelectedSitesChanged($event: Array<{site: string, patients: number, samples: number, diagnosis: number}>) {
    this.selectedSites = $event;
    this.queryService.selectedNegotiationPartnersSubject$.next($event.map(value => value.site))
  }
}
