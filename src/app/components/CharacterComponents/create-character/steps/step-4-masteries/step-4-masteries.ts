import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-step-4-masteries',

	imports: [ReactiveFormsModule],
	templateUrl: './step-4-masteries.html',
	styleUrl: './step-4-masteries.css',
})
export class Step4Masteries {
	@Input({ required: true }) form!: FormGroup;

	showModifiers: boolean = false;

	get masteries(): FormArray {
		return this.form.get('masteries') as FormArray;
	}

	get languages(): FormArray {
		return this.form.get('languages') as FormArray;
	}
}
