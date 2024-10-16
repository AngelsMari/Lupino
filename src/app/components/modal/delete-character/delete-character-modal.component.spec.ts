import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCharacterComponent } from './delete-character.component';

describe('DeleteCharacterComponent', () => {
  let component: DeleteCharacterComponent;
  let fixture: ComponentFixture<DeleteCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
