import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2Race } from './step-2-race';

describe('Step2Race', () => {
	let component: Step2Race;
	let fixture: ComponentFixture<Step2Race>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step2Race],
		}).compileComponents();

		fixture = TestBed.createComponent(Step2Race);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
