import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-step-3-stats',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './step-3-stats.html',
	styleUrls: ['./step-3-stats.css'],
})
export class Step3Stats {
	@Input({ required: true }) group!: FormGroup;
	@Input() maximum = 0;
	@Input() remaining = 0;
	@Input() secondary?: { constitution: number; resilience: number; reflex: number; charisma: number };
	@Input() resources?: { hp: number; mana: number };

	showModifiers = false;

	clampControl(name: string) {
		const ctrl = this.group.get(name);
		if (!ctrl) return;

		const raw = ctrl.value;

		// ne rien faire si vide (pendant édition)
		if (raw === null || raw === undefined || raw === '') return;

		const n = Number(raw);
		if (Number.isNaN(n)) return;

		const clamped = Math.max(30, Math.min(85, n));
		if (clamped !== n) ctrl.setValue(clamped, { emitEvent: true });
	}

	get statModifiers(): FormGroup {
		return this.group.get('statModifiers') as FormGroup;
	}
}
