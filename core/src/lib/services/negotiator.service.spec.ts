import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { NegotiatorService } from './negotiator.service';

describe('NegotiatorService', () => {
  let service: NegotiatorService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(NegotiatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
