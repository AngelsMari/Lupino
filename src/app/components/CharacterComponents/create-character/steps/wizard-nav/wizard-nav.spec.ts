import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardNav } from './wizard-nav';

describe('WizardNav', () => {
  let component: WizardNav;
  let fixture: ComponentFixture<WizardNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
