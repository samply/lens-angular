import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { RequestTargetFactoryService } from './request-target-factory.service';

describe('RequestTargetFactoryService', () => {
  let service: RequestTargetFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RequestTargetFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
