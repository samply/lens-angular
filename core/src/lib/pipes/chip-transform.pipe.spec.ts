import { inject, TestBed } from '@angular/core/testing';
import {
  CatalogueService,
  CATALOGUE_FETCHER_TOKEN
} from '../services/catalogue.service';
import {
  TypescriptCatalogueFetcherService,
  STATIC_CATALOGUE_TOKEN
} from '../services/typescript-catalogue-fetcher.service';
import { ChipTransformPipe } from './chip-transform.pipe';

describe('ChipTransformPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CATALOGUE_FETCHER_TOKEN,
          useClass: TypescriptCatalogueFetcherService
        }, {
          provide: STATIC_CATALOGUE_TOKEN,
          useValue: STATIC_CATALOGUE_TOKEN
        }
      ]
    })
  })

  it('create an instance', inject([CatalogueService] ,(catalogueService: CatalogueService) => {
    const pipe = new ChipTransformPipe(catalogueService);
    expect(pipe).toBeTruthy();
  }));
});
