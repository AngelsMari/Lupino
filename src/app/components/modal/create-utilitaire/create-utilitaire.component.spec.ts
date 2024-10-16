import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUtilitaireComponent } from './create-utilitaire.component';

describe('CreateUtilitaireComponent', () => {
  let component: CreateUtilitaireComponent;
  let fixture: ComponentFixture<CreateUtilitaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUtilitaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUtilitaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
