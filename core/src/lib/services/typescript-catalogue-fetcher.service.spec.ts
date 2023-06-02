import { TestBed } from '@angular/core/testing';
import { Category } from '../model/category';

import { STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from './typescript-catalogue-fetcher.service';

const STATIC_CATALOGUE: Array<Category> = [];

describe('TypescriptCatalogueFetcherService', () => {
  let service: TypescriptCatalogueFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: STATIC_CATALOGUE_TOKEN,
        useValue: STATIC_CATALOGUE
      }]
    });
    service = TestBed.inject(TypescriptCatalogueFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
