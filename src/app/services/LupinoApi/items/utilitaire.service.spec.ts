import { TestBed } from '@angular/core/testing';

import { UtilitaireService } from './utilitaire.service';

describe('UtilitaireService', () => {
  let service: UtilitaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilitaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
