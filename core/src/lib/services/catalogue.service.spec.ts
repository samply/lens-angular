import { TestBed } from '@angular/core/testing';
import { Category } from '../model/category';

import { CatalogueService, CATALOGUE_FETCHER_TOKEN } from './catalogue.service';
import { STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from './typescript-catalogue-fetcher.service';

const STATIC_CATALOGUE: Array<Category> = [];

describe('CatalogueService', () => {
  let service: CatalogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: CATALOGUE_FETCHER_TOKEN,
        useClass: TypescriptCatalogueFetcherService
      },
      {
        provide: STATIC_CATALOGUE_TOKEN,
        useValue: STATIC_CATALOGUE
      }]
    });
    service = TestBed.inject(CatalogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
