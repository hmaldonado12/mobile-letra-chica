import { TestBed } from '@angular/core/testing';

import { RetrieveInfoSessionService } from './retrieve-info-session.service';

describe('RetrieveInfoSessionService', () => {
  let service: RetrieveInfoSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveInfoSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
