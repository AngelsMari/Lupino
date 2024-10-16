import { TestBed } from '@angular/core/testing';

import { PotionService } from './potion.service';

describe('PotionService', () => {
  let service: PotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
