import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, LensConfig, LENS_CONFIG_TOKEN, QUERY_TRANSLATOR_TOKEN, ResultRenderer, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';

import { ResultSummaryBarComponent } from './result-summary-bar.component';

const STATIC_CATALOGUE: Array<Category> = [];

describe('ResultSummaryBarComponent', () => {
  let component: ResultSummaryBarComponent;
  let fixture: ComponentFixture<ResultSummaryBarComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform'])
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ResultSummaryBarComponent ],
      providers: [
        {
          provide: QUERY_TRANSLATOR_TOKEN,
          useValue: queryTranslatorSpy
        }, {
          provide: RESULT_TRANSFORMER_TOKEN,
          useValue: resultTransformerSpy
        }, {
          provide: LENS_CONFIG_TOKEN,
          useValue: new LensConfig()
        }, {
          provide: ChipTransformPipe
        }, {
          provide: CATALOGUE_FETCHER_TOKEN,
          useClass: TypescriptCatalogueFetcherService
        }, {
          provide: STATIC_CATALOGUE_TOKEN,
          useValue: STATIC_CATALOGUE
        }, {
          provide: ResultRenderer,
          useValue: new ResultRenderer(
            "Some Chart",
            [{ key: "Identifier" }],
            ResultSummaryBarComponent
          )
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultSummaryBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
