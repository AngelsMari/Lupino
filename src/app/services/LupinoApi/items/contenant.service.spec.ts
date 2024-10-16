import { TestBed } from '@angular/core/testing';

import { ContenantService } from './contenant.service';

describe('ContenantService', () => {
  let service: ContenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
