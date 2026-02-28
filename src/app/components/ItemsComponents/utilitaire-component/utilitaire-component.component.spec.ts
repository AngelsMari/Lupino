import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitaireComponentComponent } from './utilitaire-component.component';

describe('UtilitaireComponentComponent', () => {
  let component: UtilitaireComponentComponent;
  let fixture: ComponentFixture<UtilitaireComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UtilitaireComponentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UtilitaireComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
