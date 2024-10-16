import { TestBed } from '@angular/core/testing';

import { BazarService } from './bazar.service';

describe('BazarService', () => {
  let service: BazarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BazarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
