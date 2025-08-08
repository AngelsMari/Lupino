import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenantComponentComponent } from './contenant-component.component';

describe('ContenantComponentComponent', () => {
  let component: ContenantComponentComponent;
  let fixture: ComponentFixture<ContenantComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenantComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenantComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
