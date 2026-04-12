import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-step-1-basic',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './step-1-basic.html',
	styleUrls: ['./step-1-basic.css'],
})
export class Step1Basic {
	@Input({ required: true }) group!: FormGroup;
	@Input({ required: true }) meta!: FormGroup;

	onFileChange(evt: Event) {
		const input = evt.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			console.log(file);
			const localUrl = URL.createObjectURL(file);
			console.log(localUrl);
			this.meta.patchValue({ imageUrl: localUrl }, { emitEvent: false });
		}
	}

	// Helpers template (lisible)
	isInvalid(name: string): boolean {
		const c = this.group.get(name);
		return !!(c && c.invalid && (c.touched || c.dirty));
	}
}
