import { TestBed } from '@angular/core/testing';

import { ArmureService } from './armure.service';

describe('ArmureService', () => {
  let service: ArmureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArmureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
