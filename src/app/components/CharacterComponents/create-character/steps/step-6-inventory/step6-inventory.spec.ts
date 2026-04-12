import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step6Inventory } from './step-6-inventory';

describe('Step6Inventory', () => {
	let component: Step6Inventory;
	let fixture: ComponentFixture<Step6Inventory>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [Step6Inventory],
		}).compileComponents();

		fixture = TestBed.createComponent(Step6Inventory);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
