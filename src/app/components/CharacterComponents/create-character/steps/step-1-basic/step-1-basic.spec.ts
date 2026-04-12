import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1Basic } from './step-1-basic';

describe('Step1Basic', () => {
	let component: Step1Basic;
	let fixture: ComponentFixture<Step1Basic>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step1Basic],
		}).compileComponents();

		fixture = TestBed.createComponent(Step1Basic);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
