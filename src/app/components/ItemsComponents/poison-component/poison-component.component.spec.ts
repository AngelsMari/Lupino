import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoisonComponentComponent } from './poison-component.component';

describe('PoisonComponentComponent', () => {
  let component: PoisonComponentComponent;
  let fixture: ComponentFixture<PoisonComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoisonComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoisonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
