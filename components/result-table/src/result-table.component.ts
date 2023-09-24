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

public mockData2 = [{
  "provider": "ProCancerI",
  "provider_icon": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFoUlEQVRYhb1Xa2wUVRT+7r2zM9Pd7Wz3YbeVQlsohShUJYoIBgg+0IAKv4z+wESMUX9oMPCDGIWGRBJJMKgETSTEiGAkUWkimPAKJFZiEA2JD5paoZRKcF2alnZ37tyHP+5ueYhlNhBOMpkfc+893znnO9+5Q3CTbMWRbnt/998tRV/URqTkqbjds/3JtvNNqbgaax+5EaerO3usDw93LSn4fHlA6HzJmAutAd8HpILNyCnm8y9ro87m0+1Le24qgNqNB9oGhovbuJAz4HOAEoBZ5kQhgEAAPAB4ABJ1eZVrb7y/Ibnm0MsL+A0DSLyzb8lgke/USrmg1ETsc4AQwI6YRUUfKPhAEAARC6hyEbEjRyamqp86uWrhQPksWqnzmg37FgxKvUsDJt1CmicQgJCgIwVBAqEgJCAFoJQB4XMEgZjb89c/u2e+vdsun2dV4nzCpkOZvovFnVrDglKAVICUcCj622rdHUsnxb+b1xA/d4Er+/Nf8q0H/xBP9A/JxdCgEALwCQKl5p44y9sBrAYqLIGztmOTT9mrUMrUWQjcZtODH8xJr5uSrTnneV7OcZwiIQScc3toaCi15tuTc3d35d+VIB4cG1AKhDExLu5M6Vv/dE/oDNy1Ya93Ij/8AhgDKAUCgQRRx3c+Mu6NSQ313ZlMJl9dXX1Fyw0PDw+890zyfGH70eLenoFPEQgKraEBK18MXuOcrwjNgT9zQ49pn0cxNGzqTQmWTU2snzxhXFd9ff1/nANALBZT2Wz24tZlszvSUfsLaFXihEDAxZILg0M0NICABw9ASNNuBPC86M8v3Tf+eCaTGXBd93/FJhKJqHQ6PTIuHd8K1wUsk/RAqgmv7PpxQmgAigcNJnIKUArPor8mEolcLBYbU+kAwHEc9eys5qOEMQWLmbakFL0XChNDA9BaR0EJoLVJI5CPRqPFsPsfbs4WKefC7NcAo7Ap3PBtKCXAGOAHgJCQllaWZV03+rIt2/59nVTahuuYMlKC21PRixXogAa4MG9KgZHwOwHgdIDFiFUBjg0QAqoUf/Ge2t7QJSCUUmhlSiAlEMjQzqdtPhwtuu4qRCLl8sGj+lhzMjYSXoqVHiWgecJp2KItB+zus7ltUumJIDAApMT0pP1VNFpJCSgBNMzACamfTSs/m7rvxOkt3LbngzHDIakQg+7aMK9hT3V1dZFkV++6e1iqxeZgYqIbHDJiQwjAKACCgpTLpdJN5iCKKugfIkp/owAFrUAACpguUdBJAXIvl2q2ZozCjgDxKMAYiO/z51viy99aOG1PY2Nj3hoMxIyCxjroEsm0USpoDRMyAEINGK0AiwGEoCDlzAIwE7LEi8sfwKyzGMqg4HMQSsVD9e6br89p6kwmkwMAYFGfGz+UmrGpdclZ+Q3Ati6Rr+gbNYtY5jsuA01LQIFLe0UASAmL0fyi8VXt7fMb92ez2T7P8xQAWCQQhmCEGAeEjDIVukQ8VdJwpS8V2GIGiMXMZESJYIxeCkApUMaK4xNOx8pZ2U/mT67rqqur681kMqO3IsuxrXMWQSdRikKWHOgS0ShFmTyDkt0hAQ88AJSCw2h/1GG9IBFASQBVo6AjRI/ERXC+sdr67bm2TOeddV4ulUr1ZzKZfCKREJcTleRyOffMmTMtQRDYGMMe/frUpoGR4MHyFWtSjfvxjsfHv18oFHJXryWEKMYYHMcRNTU1PJ1OFz3PE9dSTsvzPN7S0vK71vrqb1dYgfZdhINRchWoNdLa2tqVTCZDz4NrmWXbtgJw/Ym2tsNcwUqtqgkBY0xcb991AYReSYhpR2GGEUh4KR7LwksxMROsrAOjnXKDFj4DoiROlJldtzwDvCRStCTXrOJfimtaZReSsuwGAojcFP8VZKAcMS+R8FZzYHrS/SjK9DFo80fUXFP1080A8C9aFIsvIvNvZAAAAABJRU5ErkJggg==",
  "collections": [
    {
      "name": "Collection1",
      "id": "02865f6d-15b1-4775-ab15-7bc7d95700a9",
      "studies_count": 320,
      "subjects_count": 322,
      "age_range": {
        "min": 40,
        "max": 70
      },
      "gender": ["Male", "Unknown"],
      "modality": ["MRI", "PET-CT"],
      "body_parts": ["Rectum", "Prostate", "Pelvis"],
      "description": "Example Collection 1 from ProCancer1"
    },
    {
      "name": "Collection2",
      "id": "b0e24524-0dc7-4de1-b058-8b27aff39f27",
      "provider": "ProCancerI",
      "provider_icon": "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",
      "studies_count": 15,
      "subjects_count": 24,
      "age_range": {
        "min": 20,
        "max": 40
      },
      "gender": ["Male"],
      "modality": ["MRI"],
      "body_parts": ["Rectum", "Prostate", "Pelvis"],
      "description": "Example Collection 2 from ProCancer1"
    },
    {
      "name": "Collection3",
      "id": "578a6d9f-3f4d-4670-9245-cb44a7716932",
      "provider": "ProCancerI",
      "provider_icon": "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",
      "studies_count": 10,
      "subjects_count": 4322,
      "age_range": {
        "min": 20,
        "max": 70
      },
      "gender": ["Female"],
      "modality": ["MRI"],
      "body_parts": ["Breast", "Lung"],
      "description": "Example Collection 3 from ProCancer1"
    },
    {
      "name": "Collection4",
      "id": "7c0a05b9-80a7-4122-8836-d75ce16f4be3",
      "provider": "ProCancerI",
      "provider_icon": "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",
      "studies_count": 5,
      "subjects_count": 7,
      "age_range": {
        "min": 10,
        "max": 20
      },
      "gender": ["Male", "Female"],
      "modality": ["PET"],
      "body_parts": ["Colon"],
      "description": "Example Collection 4 from ProCancer1"
    }
  ]
},
{
  "provider": "CHAIMELEON",
  "provider_icon": "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",
  "collections": [
    {
      "name": "Collection1",
      "id": "1e1bdc18-5ec9-4624-9a13-178acab2f53f",
      "studies_count": 435,
      "subjects_count": 5342,
      "age_range": {
        "min": 20,
        "max": 90
      },
      "gender": ["Male", "Unknown"],
      "modality": ["MRI", "SPECT"],
      "body_parts": ["Rectum", "Prostate", "Pelvis"],
      "description": "Example Collection 1 from CHAIMELEON"
    },
    {
      "name": "Collection2",
      "id": "de1a56e6-5102-4313-9eeb-03b8579a5f35",
      "studies_count": 1,
      "subjects_count": 5,
      "age_range": {
        "min": 20,
        "max": 40
      },
      "gender": ["Male"],
      "modality": ["PET"],
      "body_parts": ["Rectum", "Prostate", "Pelvis"],
      "description": "Example Collection 2 from CHAIMELEON"
    },
    {
      "name": "Collection3",
      "id": "25b488fb-13ef-4a87-97c7-23938b8d25d8",
      "studies_count": 10,
      "subjects_count": 4322,
      "age_range": {
        "min": 20,
        "max": 70
      },
      "gender": ["Female"],
      "modality": ["PET-CT"],
      "body_parts": ["Breast", "Lung"],
      "description": "Example Collection 3 from CHAIMELEON"
    },
    {
      "name": "Collection4",
      "id": "9c9e7bc2-baf0-40a4-ae57-ad103bb6f985",
      "studies_count": 543,
      "subjects_count": 4321,
      "age_range": {
        "min": 10,
        "max": 20
      },
      "gender": ["Male", "Female"],
      "modality": ["PET"],
      "body_parts": ["Colon"],
      "description": "Example Collection 4 from CHAIMELEON"
    }
  ]
}

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
