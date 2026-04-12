import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-step-5-skills',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './step-5-skills.html',
	styleUrls: ['./step-5-skills.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step5Skills {
	@Input({ required: true }) form!: FormGroup;

	get skills(): FormArray {
		return this.form.get('skills') as FormArray;
	}
}
