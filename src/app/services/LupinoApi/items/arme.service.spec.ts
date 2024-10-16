import { TestBed } from '@angular/core/testing';

import { ArmeService } from './arme.service';

describe('ArmeService', () => {
  let service: ArmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
