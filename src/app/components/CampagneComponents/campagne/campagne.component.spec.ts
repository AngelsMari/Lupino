import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneComponent } from './campagne.component';

describe('CampagneComponent', () => {
  let component: CampagneComponent;
  let fixture: ComponentFixture<CampagneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampagneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
