import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'character-wizard-nav',
	templateUrl: './wizard-nav.html',
	styleUrls: ['./wizard-nav.css'],
})
export class WizardNavComponent {
	@Input({ required: true }) step!: number;
	@Input({ required: true }) maxStep!: number;

	@Input() canNext = true;
	@Input() canSubmit = false;
	@Input() isEdit = false;

	@Output() next = new EventEmitter<void>();
	@Output() prev = new EventEmitter<void>();
	@Output() submit = new EventEmitter<void>();
}
