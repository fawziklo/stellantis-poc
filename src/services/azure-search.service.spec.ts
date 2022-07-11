import { TestBed } from '@angular/core/testing';

import { AzureSearchService } from './azure-search.service';

describe('AzureSearchService', () => {
  let service: AzureSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
