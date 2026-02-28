import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrnementComponent } from './ornement';

describe('Ornement', () => {
	let component: OrnementComponent;
	let fixture: ComponentFixture<OrnementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrnementComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OrnementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
