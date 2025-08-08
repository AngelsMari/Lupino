import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BazarComponentComponent } from './bazar-component.component';

describe('BazarComponentComponent', () => {
  let component: BazarComponentComponent;
  let fixture: ComponentFixture<BazarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BazarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BazarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
