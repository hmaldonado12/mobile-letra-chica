import { TestBed } from '@angular/core/testing';

import { CreateCategoryRepositoryService } from './create-category-repository.service';

describe('CreateCategoryRepositoryService', () => {
  let service: CreateCategoryRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCategoryRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
