import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterOverview } from './character-overview';

describe('CharacterOverview', () => {
  let component: CharacterOverview;
  let fixture: ComponentFixture<CharacterOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
