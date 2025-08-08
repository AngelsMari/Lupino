import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotionComponentComponent } from './potion-component.component';

describe('PotionComponentComponent', () => {
  let component: PotionComponentComponent;
  let fixture: ComponentFixture<PotionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PotionComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
