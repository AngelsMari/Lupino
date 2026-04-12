import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { BonusSlot, Race, RaceBonus } from '../../../models/race';

type EffectType = 'passive' | 'hpPerLevel' | 'masteryChoice' | 'secondaryStatBonus';

@Component({
	selector: 'app-race-create',
	templateUrl: './race-create.component.html',
	styleUrl: './race-create.component.css',
	imports: [ReactiveFormsModule],
})
export class RaceCreateComponent implements OnInit {
	@Input() race?: Race;

	raceForm: FormGroup;
	isEditMode = false;

	bonusSlots: { value: BonusSlot; label: string }[] = [
		{ value: 'corps', label: 'Corps' },
		{ value: 'membre', label: 'Membre' },
		{ value: 'aura', label: 'Aura' },
		{ value: 'carrure', label: 'Carrure' },
		{ value: 'yeux', label: 'Yeux' },
	];

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private raceService: RaceService,
	) {
		this.raceForm = this.fb.group(
			{
				_id: [''],
				name: ['', Validators.required],
				type: ['', Validators.required],
				description: ['', Validators.required],

				bonus1: this.createBonusGroup(true),
				bonus2: this.createBonusGroup(false),
			},
			{ validators: this.noDuplicateBonusSlotsValidator },
		);

		this.watchBonus2();
	}

	ngOnInit(): void {
		this.isEditMode = !!this.race;

		if (this.isEditMode && this.race) {
			const b1 = this.race.bonuses?.[0];
			const b2 = this.race.bonuses?.[1];

			this.raceForm.patchValue({
				_id: this.race._id,
				name: this.race.name,
				type: this.race.type,
				description: this.race.description ?? '',
			});

			if (b1) this.patchBonus(this.bonus1, b1);
			if (b2) this.patchBonus(this.bonus2, b2);
		}
	}

	private createBonusGroup(required: boolean): FormGroup {
		return this.fb.group({
			_id: [''],
			slot: ['', required ? Validators.required : []],
			value: ['', required ? Validators.required : []],
			effectType: [''],

			passiveDescription: [''],

			hpPerLevelValue: [null],

			mastery: [''],
			masteryChoiceCount: [1],

			secondaryStat: [''],
			secondaryStatValue: [null],
		});
	}

	get bonus1(): FormGroup {
		return this.raceForm.get('bonus1') as FormGroup;
	}

	get bonus2(): FormGroup {
		return this.raceForm.get('bonus2') as FormGroup;
	}

	private watchBonus2() {
		this.bonus2.valueChanges.subscribe(() => {
			const slot = this.bonus2.get('slot')?.value;
			const value = this.bonus2.get('value')?.value?.trim();
			const effectType = this.bonus2.get('effectType')?.value;

			const started = !!slot || !!value || !!effectType;

			if (started) {
				this.bonus2.get('slot')?.setValidators(Validators.required);
				this.bonus2.get('value')?.setValidators(Validators.required);
				this.bonus2.get('effectType');
			} else {
				this.bonus2.get('slot')?.clearValidators();
				this.bonus2.get('value')?.clearValidators();
				this.bonus2.get('effectType')?.clearValidators();
			}

			this.bonus2.get('slot')?.updateValueAndValidity({ emitEvent: false });
			this.bonus2.get('value')?.updateValueAndValidity({ emitEvent: false });
			this.bonus2.get('effectType')?.updateValueAndValidity({ emitEvent: false });
		});
	}

	private noDuplicateBonusSlotsValidator(control: AbstractControl): ValidationErrors | null {
		const b1 = control.get('bonus1.slot')?.value;
		const b2 = control.get('bonus2.slot')?.value;

		if (b1 && b2 && b1 === b2) {
			return { duplicateBonusSlot: true };
		}

		return null;
	}

	isSlotTaken(slot: BonusSlot): boolean {
		return this.bonus1.get('slot')?.value === slot;
	}

	private buildBonusFromGroup(group: FormGroup): RaceBonus | null {
		const slot = group.get('slot')?.value;
		const value = group.get('value')?.value?.trim();

		if (!slot || !value) {
			return null;
		}

		return {
			_id: group.get('_id')?.value ?? '',
			slot,
			value,
		};
	}

	private patchBonus(group: FormGroup, bonus: RaceBonus): void {
		group.patchValue({
			_id: bonus._id,
			slot: bonus.slot,
			value: bonus.value,
		});
	}

	submit(): void {
		if (this.raceForm.invalid) return;

		const bonuses = [this.buildBonusFromGroup(this.bonus1), this.buildBonusFromGroup(this.bonus2)].filter((b): b is RaceBonus => !!b);

		const formValue = this.raceForm.value;

		const payload: Race = {
			_id: this.isEditMode ? formValue._id : '',
			name: (formValue.name ?? '').trim(),
			type: formValue.type,
			description: (formValue.description ?? '').trim(),
			bonuses,
		};

		const request$ = this.isEditMode ? this.raceService.editRace(payload) : this.raceService.createRace(payload);

		request$.subscribe(() => {
			this.activeModal.close(this.isEditMode ? 'Race modifiée' : 'Race créée');
		});
	}

	cancel(): void {
		this.activeModal.dismiss('Cancel');
	}
}
