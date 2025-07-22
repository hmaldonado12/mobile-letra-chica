import { TestBed } from '@angular/core/testing';

import { SaveDocumentRepositoryService } from './save-document-repository.service';

describe('SaveDocumentRepositoryService', () => {
  let service: SaveDocumentRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveDocumentRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
