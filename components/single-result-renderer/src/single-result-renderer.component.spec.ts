import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, LensConfig, LENS_CONFIG_TOKEN, QUERY_TRANSLATOR_TOKEN, ResultRenderer, ResultRendererComponent, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';

import { SingleResultRendererComponent } from './single-result-renderer.component';
import { SingleResultRendererDirective } from './single-result-renderer.directive';

const STATIC_CATALOGUE: Array<Category> = [];
const MOCK_RESULT_RENDERER = new ResultRenderer(
  "Some Chart",
  [{ key: "Identifier" }],
  ResultRendererComponent
)


describe('SingleResultRendererComponent', () => {
  let component: SingleResultRendererComponent;
  let fixture: ComponentFixture<SingleResultRendererComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform'])
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SingleResultRendererComponent, SingleResultRendererDirective],
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
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SingleResultRendererComponent);
    component = fixture.componentInstance;
    component.resultRenderer = MOCK_RESULT_RENDERER
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
