import { TestBed } from '@angular/core/testing';

import { MeasurePassthroughService } from './measure-passthrough.service';

describe('MeasurePassthroughService', () => {
  let service: MeasurePassthroughService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurePassthroughService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
