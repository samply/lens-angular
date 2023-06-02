import '@angular/localize/init'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CATALOGUE_FETCHER_TOKEN, Category, ChipTransformPipe, Criteria, LensConfig, LENS_CONFIG_TOKEN, QUERY_TRANSLATOR_TOKEN, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';

import { DateConditionBuilderComponent } from './date-condition-builder.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

const STATIC_CATALOGUE: Array<Category> = [
  new Category(
    "donor",
    "Donor/Clinical Information",
    [
      new Criteria(
        "date_of_diagnosis",
        { en: "Diagnosedatum", de: "Date of diagnosis" },
        "date",
        "",
        ["BETWEEN", "EQUALS", "LOWER_THAN", "GREATER_THAN"], // less or equal, greater or equal, unequal
      )
    ]
  )
];

describe('DateConditionBuilderComponent', () => {
  let component: DateConditionBuilderComponent;
  let fixture: ComponentFixture<DateConditionBuilderComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform']);
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CalendarModule,
        FormsModule
      ],
      declarations: [DateConditionBuilderComponent],
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

    fixture = TestBed.createComponent(DateConditionBuilderComponent);
    component = fixture.componentInstance;
    component.key = "date_of_diagnosis";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
