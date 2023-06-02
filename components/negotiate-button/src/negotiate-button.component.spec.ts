import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CATALOGUE_FETCHER_TOKEN, Category, chartColors, ChipTransformPipe, ColorScheme, LensConfig, LENS_CONFIG_TOKEN, primaryButtonColors, QUERY_TRANSLATOR_TOKEN, RESULT_TRANSFORMER_TOKEN, STATIC_CATALOGUE_TOKEN, TypescriptCatalogueFetcherService } from '@samply/lens-core';
import { ButtonModule } from 'primeng/button';

import { NegotiateButtonComponent } from './negotiate-button.component';

const STATIC_CATALOGUE: Array<Category> = [];

const primaryButtonColors : primaryButtonColors = {
    buttonSuccess: ['#ffffff', '#003674'],
    buttonWarning: ['#ffffff', '#E95713'],
    buttonInfo: ['#003674', '#ffffff'],
  }

const chartColors: chartColors = {}

const colorScheme = new ColorScheme()
    .setPrimaryButtonColors(primaryButtonColors)


describe('NegotiateButtonComponent', () => {
  let component: NegotiateButtonComponent;
  let fixture: ComponentFixture<NegotiateButtonComponent>;

  beforeEach(async () => {
    let queryTranslatorSpy = jasmine.createSpyObj(['transform'])
    let resultTransformerSpy = jasmine.createSpyObj(['transform']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ButtonModule
      ],
      declarations: [ NegotiateButtonComponent ],
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

    fixture = TestBed.createComponent(NegotiateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
