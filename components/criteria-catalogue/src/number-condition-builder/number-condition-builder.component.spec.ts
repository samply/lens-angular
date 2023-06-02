import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, Criteria, LensConfig, LENS_CONFIG_TOKEN, QUERY_TRANSLATOR_TOKEN, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';

import { NumberConditionBuilderComponent } from './number-condition-builder.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

const STATIC_CATALOGUE: Array<Category> = [
new Category(
      "tumor_classification",
      "Klassifikation von Tumoren",
      [
        new Criteria(
          "year_of_diagnosis",
          {de: "Diagnosejahr", en: "Year of Diagnosis"},
          "number",
          "",
          ["LOWER_THAN", "GREATER_THAN", "BETWEEN"],
        )
      ]
    )
];

describe('NumberConditionBuilderComponent', () => {
  let component: NumberConditionBuilderComponent;
  let fixture: ComponentFixture<NumberConditionBuilderComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform']);
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        InputNumberModule,
        FormsModule
      ],
      declarations: [NumberConditionBuilderComponent],
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

    fixture = TestBed.createComponent(NumberConditionBuilderComponent);
    component = fixture.componentInstance;
    component.key = "year_of_diagnosis";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
