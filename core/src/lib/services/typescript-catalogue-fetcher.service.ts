import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Category} from "../model/category";
import {BehaviorSubject, Observable} from "rxjs";
import { CatalogueFetcher } from '../model/catalogue-fetcher';

export const STATIC_CATALOGUE_TOKEN = new InjectionToken('StaticCatalogue');

@Injectable({
  providedIn: 'root'
})
export class TypescriptCatalogueFetcherService implements CatalogueFetcher {

  private catalogueSubject$: BehaviorSubject<Array<Category>> = new BehaviorSubject<Array<Category>>([])
  public catalogue$: Observable<any> = this.catalogueSubject$.asObservable();

  constructor(
    @Inject(STATIC_CATALOGUE_TOKEN) staticCatalogue: Array<Category>,
  ) {
    this.catalogueSubject$.next(staticCatalogue)
  }

  fetch(): Observable<Array<Category>> {
    return this.catalogue$;
  }
}
