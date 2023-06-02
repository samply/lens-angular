import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LensConfig, LENS_CONFIG_TOKEN } from '../lens-config';
import { QUERY_TRANSLATOR_TOKEN } from '../model/query-translator';
import { RESULT_TRANSFORMER_TOKEN } from '../model/result-transformer';

import { QueryService } from './query.service';
import { ChipTransformPipe } from '../pipes/chip-transform.pipe';
import { CATALOGUE_FETCHER_TOKEN } from './catalogue.service';
import { STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from './typescript-catalogue-fetcher.service';
import { Category } from '../model/category';

const STATIC_CATALOGUE: Array<Category> = [];

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(() => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform']);
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: QUERY_TRANSLATOR_TOKEN,
        useValue: queryTranslatorSpy
      },{
        provide: RESULT_TRANSFORMER_TOKEN,
        useValue: resultTransformerSpy
      },{
        provide: LENS_CONFIG_TOKEN,
        useValue: new LensConfig()
      },{
        provide: ChipTransformPipe
      },{
        provide: CATALOGUE_FETCHER_TOKEN,
        useClass: TypescriptCatalogueFetcherService
      },{
        provide: STATIC_CATALOGUE_TOKEN,
        useValue: STATIC_CATALOGUE
      }]
    });
    service = TestBed.inject(QueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
