import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterHeader } from './character-header';

describe('CharacterHeader', () => {
  let component: CharacterHeader;
  let fixture: ComponentFixture<CharacterHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
