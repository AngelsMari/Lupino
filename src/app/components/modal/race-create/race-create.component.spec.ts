import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceCreateModalComponent } from './race-createcomponent';

describe('RaceCreateModalComponent', () => {
  let component: RaceCreateModalComponent;
  let fixture: ComponentFixture<RaceCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaceCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
