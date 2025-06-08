import { TestBed } from '@angular/core/testing';

import { DocumentAnalysisRepositoryService } from './document-analysis-repository.service';

describe('DocumentAnalysisRepositoryService', () => {
  let service: DocumentAnalysisRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentAnalysisRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
