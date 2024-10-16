import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBazarComponent } from './create-bazar.component';

describe('CreateBazarComponent', () => {
  let component: CreateBazarComponent;
  let fixture: ComponentFixture<CreateBazarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBazarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBazarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
