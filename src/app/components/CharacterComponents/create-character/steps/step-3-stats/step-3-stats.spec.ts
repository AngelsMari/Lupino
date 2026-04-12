import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3Stats } from './step-3-stats';

describe('Step3Stats', () => {
	let component: Step3Stats;
	let fixture: ComponentFixture<Step3Stats>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step3Stats],
		}).compileComponents();

		fixture = TestBed.createComponent(Step3Stats);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
