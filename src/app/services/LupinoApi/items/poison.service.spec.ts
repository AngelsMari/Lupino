import { TestBed } from '@angular/core/testing';

import { PoisonService } from './poison.service';

describe('PoisonService', () => {
  let service: PoisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
