import { TestBed } from '@angular/core/testing';

import { SaveInfoSessionService } from './save-info-session.service';

describe('SaveInfoSessionService', () => {
  let service: SaveInfoSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveInfoSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
