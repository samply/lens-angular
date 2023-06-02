import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LensConfig, LENS_CONFIG_TOKEN } from '../lens-config';
import { Category } from '../model/category';
import { QUERY_TRANSLATOR_TOKEN } from '../model/query-translator';
import { RESULT_TRANSFORMER_TOKEN } from '../model/result-transformer';
import { CATALOGUE_FETCHER_TOKEN } from '../services/catalogue.service';
import { STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '../services/typescript-catalogue-fetcher.service';

import { ResultRendererComponent } from './result-renderer.component';
import { ChipTransformPipe } from '../pipes/chip-transform.pipe';
import { ResultRenderer } from '../model/result-renderer';

const STATIC_CATALOGUE: Array<Category> = [];

describe('ResultRendererComponent', () => {
  let component: ResultRendererComponent;
  let fixture: ComponentFixture<ResultRendererComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform'])
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
            ResultRendererComponent
          )
        }
      ],
      declarations: [ResultRendererComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResultRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
