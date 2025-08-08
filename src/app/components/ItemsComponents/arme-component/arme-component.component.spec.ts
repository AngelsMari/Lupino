import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmeComponentComponent } from './arme-component.component';

describe('ArmeComponentComponent', () => {
  let component: ArmeComponentComponent;
  let fixture: ComponentFixture<ArmeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArmeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
