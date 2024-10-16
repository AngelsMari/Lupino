import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoisonComponent } from './create-poison.component';

describe('CreatePoisonComponent', () => {
  let component: CreatePoisonComponent;
  let fixture: ComponentFixture<CreatePoisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePoisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePoisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
