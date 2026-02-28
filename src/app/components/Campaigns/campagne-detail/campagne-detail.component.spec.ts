import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneDetailComponent } from './campagne-detail.component';

describe('CampagneDetailComponent', () => {
  let component: CampagneDetailComponent;
  let fixture: ComponentFixture<CampagneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CampagneDetailComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CampagneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
