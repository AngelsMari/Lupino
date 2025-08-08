import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmureComponentComponent } from './armure-component.component';

describe('ArmureComponentComponent', () => {
  let component: ArmureComponentComponent;
  let fixture: ComponentFixture<ArmureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArmureComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
