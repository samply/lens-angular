import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, LensConfig, LENS_CONFIG_TOKEN, QUERY_TRANSLATOR_TOKEN, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';
import { StringConditionBuilderComponent } from './string-condition-builder.component';

const STATIC_CATALOGUE: Array<Category> = [];

describe('StringConditionBuilderComponent', () => {
  let component: StringConditionBuilderComponent;
  let fixture: ComponentFixture<StringConditionBuilderComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform']);
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [StringConditionBuilderComponent],
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
        },
        {
          provide: CATALOGUE_FETCHER_TOKEN,
          useClass: TypescriptCatalogueFetcherService
        }, {
          provide: STATIC_CATALOGUE_TOKEN,
          useValue: STATIC_CATALOGUE
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StringConditionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
