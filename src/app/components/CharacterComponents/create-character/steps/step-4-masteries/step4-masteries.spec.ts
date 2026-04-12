import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4Masteries } from './step-4-masteries';

describe('Step4Masteries', () => {
	let component: Step4Masteries;
	let fixture: ComponentFixture<Step4Masteries>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step4Masteries],
		}).compileComponents();

		fixture = TestBed.createComponent(Step4Masteries);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
