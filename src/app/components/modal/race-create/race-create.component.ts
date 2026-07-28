import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { BonusSlot, Race, RaceBonus } from '../../../models/race';
import { environment } from '@environments/environment';

type RaceWithImage = Race & { image?: string };

@Component({
	selector: 'app-race-create',
	templateUrl: './race-create.component.html',
	styleUrl: './race-create.component.css',
	imports: [ReactiveFormsModule],
})
export class RaceCreateComponent implements OnInit, OnDestroy {
	@Input() race?: RaceWithImage;

	raceForm: FormGroup;
	isEditMode = false;
	isSubmitting = false;
	imagePreview = '';
	imageError = '';
	selectedImageFile: File | null = null;

	private readonly maxImageSize = 5 * 1024 * 1024;
	private objectUrl: string | null = null;

	readonly bonusSlots: { value: BonusSlot; label: string }[] = [
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
				name: ['', [Validators.required, Validators.maxLength(80)]],
				type: ['', Validators.required],
				description: ['', [Validators.required, Validators.maxLength(1200)]],
				image: [''],
				bonus1: this.createBonusGroup(true),
				bonus2: this.createBonusGroup(false),
			},
			{ validators: this.noDuplicateBonusSlotsValidator },
		);

		this.watchBonus2();
	}

	ngOnInit(): void {
		this.isEditMode = !!this.race;

		if (!this.race) return;

		const firstBonus = this.race.bonuses?.[0];
		const secondBonus = this.race.bonuses?.[1];
		const image = this.race.image ?? '';

		this.raceForm.patchValue({
			_id: this.race._id,
			name: this.race.name,
			type: this.race.type,
			description: this.race.description ?? '',
			image,
		});

		this.imagePreview = image;

		if (firstBonus) this.patchBonus(this.bonus1, firstBonus);
		if (secondBonus) this.patchBonus(this.bonus2, secondBonus);
	}

	ngOnDestroy(): void {
		this.revokeObjectUrl();
	}

	get bonus1(): FormGroup {
		return this.raceForm.get('bonus1') as FormGroup;
	}

	get bonus2(): FormGroup {
		return this.raceForm.get('bonus2') as FormGroup;
	}

	get descriptionLength(): number {
		return String(this.raceForm.get('description')?.value ?? '').length;
	}

	onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		this.imageError = '';

		if (!file) {
			return;
		}

		const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

		if (!allowedTypes.includes(file.type)) {
			this.imageError = 'Le fichier doit être une image PNG, JPG ou WEBP.';
			input.value = '';
			return;
		}

		if (file.size > this.maxImageSize) {
			this.imageError = 'L’image ne doit pas dépasser 5 Mo.';
			input.value = '';
			return;
		}

		this.raceService.uploadImage(file).subscribe((data: any) => {
			if (data.result == 'OK') {
				this.raceForm.patchValue({
					image: environment.apiUrl + '/public/raceImg/' + data.file.filename,
				});
			} else {
				alert("Erreur lors de l'upload de l'image");
			}
		});

		this.revokeObjectUrl();

		this.selectedImageFile = file;
		this.objectUrl = URL.createObjectURL(file);
		this.imagePreview = this.objectUrl;
	}

	removeImage(): void {
		this.revokeObjectUrl();

		this.selectedImageFile = null;
		this.imagePreview = '';
		this.imageError = '';

		this.raceForm.patchValue({
			image: '',
		});
	}

	isInvalid(controlName: string): boolean {
		const control = this.raceForm.get(controlName);
		return !!(control?.invalid && (control.touched || control.dirty));
	}

	isBonusInvalid(group: FormGroup, controlName: string): boolean {
		const control = group.get(controlName);
		return !!(control?.invalid && (control.touched || control.dirty));
	}

	isSlotTaken(slot: BonusSlot): boolean {
		return this.bonus1.get('slot')?.value === slot;
	}

	submit(): void {
		if (this.raceForm.invalid) {
			this.raceForm.markAllAsTouched();
			return;
		}

		this.isSubmitting = true;

		const bonuses = [
			this.buildBonusFromGroup(this.bonus1),
			this.buildBonusFromGroup(this.bonus2),
		].filter((b): b is RaceBonus => !!b);

		const formValue = this.raceForm.value;

		const payload: Race = {
			_id: this.isEditMode ? formValue._id : '',
			name: (formValue.name ?? '').trim(),
			type: formValue.type,
			description: (formValue.description ?? '').trim(),
			bonuses,
			image: formValue.image,
		};

		const request$ = this.isEditMode
			? this.raceService.editRace(payload)
			: this.raceService.createRace(payload);

		request$.subscribe(() => {
			this.activeModal.close(this.isEditMode ? 'Race modifiée' : 'Race créée');
		});
	}

	cancel(): void {
		this.activeModal.dismiss('Cancel');
	}

	private createBonusGroup(required: boolean): FormGroup {
		return this.fb.group({
			_id: [''],
			slot: ['', required ? Validators.required : []],
			value: ['', required ? Validators.required : []],
		});
	}

	private watchBonus2(): void {
		this.bonus2.valueChanges.subscribe(() => {
			const slot = this.bonus2.get('slot')?.value;
			const value = String(this.bonus2.get('value')?.value ?? '').trim();
			const started = !!slot || !!value;

			if (started) {
				this.bonus2.get('slot')?.setValidators(Validators.required);
				this.bonus2.get('value')?.setValidators(Validators.required);
			} else {
				this.bonus2.get('slot')?.clearValidators();
				this.bonus2.get('value')?.clearValidators();
			}

			this.bonus2.get('slot')?.updateValueAndValidity({ emitEvent: false });
			this.bonus2.get('value')?.updateValueAndValidity({ emitEvent: false });
		});
	}

	private noDuplicateBonusSlotsValidator(control: AbstractControl): ValidationErrors | null {
		const firstSlot = control.get('bonus1.slot')?.value;
		const secondSlot = control.get('bonus2.slot')?.value;

		return firstSlot && secondSlot && firstSlot === secondSlot
			? { duplicateBonusSlot: true }
			: null;
	}

	private buildBonusFromGroup(group: FormGroup): RaceBonus | null {
		const slot = group.get('slot')?.value;
		const value = String(group.get('value')?.value ?? '').trim();

		if (!slot || !value) return null;

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

	private revokeObjectUrl(): void {
		if (!this.objectUrl) return;
		URL.revokeObjectURL(this.objectUrl);
		this.objectUrl = null;
	}
}
