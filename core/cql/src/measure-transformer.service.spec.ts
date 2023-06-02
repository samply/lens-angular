import { TestBed } from '@angular/core/testing';

import { MeasureTransformerService } from './measure-transformer.service';

describe('MeasureTransformerService', () => {
  let service: MeasureTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
