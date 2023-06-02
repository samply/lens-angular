import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, Condition, Criteria, LensConfig, LENS_CONFIG_TOKEN, Operation, QUERY_TRANSLATOR_TOKEN, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';
import { CheckboxModule } from 'primeng/checkbox';

import { PredefinedConditionBuilderComponent } from './predefined-condition-builder.component';

const STATIC_CATALOGUE: Array<Category> = [
  new Category(
      "urn:dktk:code:2:2",
      "Neuroonkologie",
      [
        new Criteria(
          "gliom_all_groups",
          {de: "Gliome, alle Gruppen", en: "Gliom, all groups"},
          "predefined",
          "",
          [],
          [
            new Operation(
              "AND",
              [
                new Condition("diagnosis", "CONTAINS", "", "D43.%"),
                new Operation("OR", [
                    new Condition("59847-4", "EQUALS", "", "9383/1"),
                    new Condition("59847-4", "EQUALS", "", "9384/1"),
                    new Condition("59847-4", "EQUALS", "", "9394/1"),
                    new Condition("59847-4", "EQUALS", "", "9421/1")
                  ], "", "", ""
                )
              ],
              "urn:dktk:code:3:2",
              "Gliom - Grad I",
              "",
            )
          ]
        )
      ]
    )
];

describe('PredefinedConditionBuilderComponent', () => {
  let component: PredefinedConditionBuilderComponent;
  let fixture: ComponentFixture<PredefinedConditionBuilderComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform'])
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CheckboxModule,
        FormsModule
      ],
      declarations: [PredefinedConditionBuilderComponent],
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

    fixture = TestBed.createComponent(PredefinedConditionBuilderComponent);
    component = fixture.componentInstance;
    component.key = "gliom_all_groups"
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
