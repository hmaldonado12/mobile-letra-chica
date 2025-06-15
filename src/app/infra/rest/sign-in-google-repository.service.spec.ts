import { TestBed } from '@angular/core/testing';

import { SignInGoogleRepositoryService } from './sign-in-google-repository.service';

describe('SignInGoogleRepositoryService', () => {
  let service: SignInGoogleRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignInGoogleRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
