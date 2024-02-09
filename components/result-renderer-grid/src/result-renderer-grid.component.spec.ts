import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CATALOGUE_FETCHER_TOKEN,
  Category,
  ChipTransformPipe,
  LensConfig,
  LENS_CONFIG_TOKEN,
  QUERY_TRANSLATOR_TOKEN,
  RESULT_TRANSFORMER_TOKEN,
  STATIC_CATALOGUE_TOKEN,
  TypescriptCatalogueFetcherService
} from '@samply/lens-core';

import { ResultRendererGridComponent } from './result-renderer-grid.component';
import { ResultRendererGridDirective } from './result-renderer-grid.directive';

const STATIC_CATALOGUE: Array<Category> = [];

describe('ResultRendererGridComponent', () => {
  let component: ResultRendererGridComponent;
  let fixture: ComponentFixture<ResultRendererGridComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform']);
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      declarations: [ ResultRendererGridComponent, ResultRendererGridDirective ],
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultRendererGridComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
