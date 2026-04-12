import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5Skills } from './step-5-skills';

describe('Step5Skills', () => {
	let component: Step5Skills;
	let fixture: ComponentFixture<Step5Skills>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step5Skills],
		}).compileComponents();

		fixture = TestBed.createComponent(Step5Skills);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
