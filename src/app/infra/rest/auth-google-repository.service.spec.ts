import { TestBed } from '@angular/core/testing';

import { AuthGoogleRepositoryService } from './auth-google-repository.service';

describe('AuthGoogleRepositoryService', () => {
  let service: AuthGoogleRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGoogleRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
