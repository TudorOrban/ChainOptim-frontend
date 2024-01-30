import { TestBed } from '@angular/core/testing';

import { FallbackManagerService } from './fallback-manager.service';

describe('FallbackManagerService', () => {
  let service: FallbackManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FallbackManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
