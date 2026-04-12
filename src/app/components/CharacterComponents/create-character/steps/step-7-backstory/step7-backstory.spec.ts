import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step7Backstory } from './step-7-backstory';

describe('Step7Backstory', () => {
	let component: Step7Backstory;
	let fixture: ComponentFixture<Step7Backstory>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step7Backstory],
		}).compileComponents();

		fixture = TestBed.createComponent(Step7Backstory);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
