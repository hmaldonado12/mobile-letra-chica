import { TestBed } from '@angular/core/testing';

import { RetrieveCagetoryService } from './retrieve-cagetory.service';

describe('RetrieveCagetoryService', () => {
  let service: RetrieveCagetoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveCagetoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
