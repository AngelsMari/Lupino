import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContenantComponent } from './create-contenant.component';

describe('CreateContenantComponent', () => {
	let component: CreateContenantComponent;
	let fixture: ComponentFixture<CreateContenantComponent>;
	
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreateContenantComponent]
		})
		.compileComponents();
		
		fixture = TestBed.createComponent(CreateContenantComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
