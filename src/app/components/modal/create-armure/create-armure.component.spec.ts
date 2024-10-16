import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArmureComponent } from './create-armure.component';

describe('CreateArmureComponent', () => {
  let component: CreateArmureComponent;
  let fixture: ComponentFixture<CreateArmureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateArmureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateArmureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
