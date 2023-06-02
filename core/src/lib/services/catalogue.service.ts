import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Category} from "../model/category";
import {Criteria} from "../model/criteria";
import {TreeNode} from "primeng/api";
import {Condition} from "../model/condition";
import {firstValueFrom, Observable} from "rxjs";
import { CatalogueFetcher } from '../model/catalogue-fetcher';


export const CATALOGUE_FETCHER_TOKEN = new InjectionToken('CatalogueFetcher');

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  catalogue$: Observable<Array<Category>>
  catalogueCache: Array<Category> = []

  constructor(
    @Inject(CATALOGUE_FETCHER_TOKEN) private catalogueFetcher: CatalogueFetcher,
  ) {
    this.catalogue$ = this.catalogueFetcher.fetch();

    // set the current catalogue
    this.catalogue$.subscribe(catalogue => {
      this.catalogueCache = catalogue
    })
  }

  // TODO: Move logic for querying the MDR to a separate MDRCatalogueFetcherService
  getEntities(catalogue: Array<Category>): void {
    this.buildEntityTree(catalogue)
  }

  buildEntityTree(catalogue: Array<Category>): any {
    catalogue[2].children.forEach((maingroup: Category | Criteria) => {
      if (maingroup instanceof Category) {
        maingroup.children.forEach((subgroup: Category | Criteria) => {
          if (subgroup instanceof Criteria) {
            subgroup.values?.forEach((value) => {
              /*this.httpClient.get<any>("https://mdr.ccp-it.dktk.dkfz.de/v3/api/mdr/catalogs/urn:dktk:catalog:1:2/codes/" + value.key + "/slots").subscribe(slot => {
                let result = JSON.parse(xml2json(slot[0].slot_value, {compact: true}))
                if(value.predefined) {
                  value.predefined.children = this.translateXMLtoJSON(result)
                  //console.log(this.mockCatalogue[2])
                }
              })*/
            })
          }
        })
      }
    })
  }

  translateXMLtoJSON(xml: any): Condition[] {
    let diag = xml['ns8:And']['ns8:Or'][0]['ns8:Like']
    let morph = xml['ns8:And']['ns8:Or'][1]['ns8:Eq']
    let entity: any[] = []
    let entity2: string[] = []

    if (Array.isArray(diag)) {
      const diagOperation: any[] = []
      diag.forEach((elem: any) => {
        diagOperation.push(new Condition("urn:dktk:dataelement:29:2", "CONTAINS","", this.getElement(elem)))
      })
      // entity.push(new Operation("OR", diagOperation))
    } else {
      entity.push(new Condition("urn:dktk:dataelement:29:2", "CONTAINS","", this.getElement(diag)))
    }
    if (Array.isArray(morph)) {
      const morphOperation: any[] = []
      morph.forEach((elem: any) => {
        morphOperation.push(new Condition("urn:dktk:dataelement:7:2", "EQUALS","", this.getElement(elem)))
      })
      // entity.push(new Operation("OR", morphOperation))
    } else {
      entity.push(new Condition("urn:dktk:dataelement:7:2", "EQUALS","", this.getElement(morph)))
    }
    return entity
  }

  getElement(element: any): string {
    return element['ns4:Attribute']['ns3:Value']['_text']
  }

  getCriteria(key: string): Criteria {
    let candidates: Criteria[] = [];
    this.catalogueCache.forEach(category => {
      let foundCriteria = category.getCriteria(key);
      if (foundCriteria) {
        candidates = candidates.concat(foundCriteria)
      }
    })
    if (candidates.length > 1) {
      console.warn(`Detected multiple criteria with key ${key} in the catalogue. Please clean your catalogue, ui may not work as expected!`)
    }
    return candidates[0];
  }

  async convertToTreenode() {
    let catalogue = await firstValueFrom(this.catalogue$);
    return <TreeNode[]> catalogue.map(item => item.convertToTreeNode())
  }

  getCriterias(): Array<Criteria> {
    let result: Array<Criteria> = []
    this.catalogueCache.forEach(item => {
      result = result.concat(item.getCriterias());
    })
    return result;
  }
}
