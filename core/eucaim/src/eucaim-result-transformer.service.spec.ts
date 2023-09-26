import { TestBed } from '@angular/core/testing';

import { EucaimResultTransformerService } from './eucaim-result-transformer.service';

describe('EucaimResultTransformerService', () => {
  let service: EucaimResultTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EucaimResultTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
