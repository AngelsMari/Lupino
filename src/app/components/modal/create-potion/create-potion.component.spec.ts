import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePotionComponent } from './create-potion.component';

describe('CreatePotionComponent', () => {
  let component: CreatePotionComponent;
  let fixture: ComponentFixture<CreatePotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
