import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { lineageValidator, noHtmlValidator } from './character.validators';

export const createCharacterForm = (fb: FormBuilder): FormGroup => {
	return fb.group({
		meta: fb.group({
			_id: [''],
			imageUrl: [''],
			isPNJ: [false],
		}),

		basic: fb.group({
			name: ['', [Validators.required, noHtmlValidator]],
			level: [1, [Validators.required, Validators.min(1)]],
			age: ['', [noHtmlValidator]],
			skincolor: ['', [noHtmlValidator]],
			height: ['', [noHtmlValidator]],
			weight: ['', [noHtmlValidator]],
			sexe: ['', [noHtmlValidator]],
			eyes: ['', [noHtmlValidator]],
			hair: ['', [noHtmlValidator]],
			positive_trait: ['', [Validators.required, noHtmlValidator]],
			negative_trait: ['', [Validators.required, noHtmlValidator]],
		}),

		race: fb.group(
			{
				kind: ['pure', [Validators.required]],
				raceId: ['', []],
				parentRaceIds: fb.control<string[]>([]),
				chosenBonusIds: fb.control<string[]>([]),
			},
			{ validators: [lineageValidator] },
		),

		stats: fb.group({
			strength: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
			agility: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
			endurance: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
			social: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
			mental: [30, [Validators.required, Validators.min(30), Validators.max(85)]],

			statModifiers: fb.group({
				primary: fb.group({
					strength: [0],
					agility: [0],
					endurance: [0],
					social: [0],
					mental: [0],
				}),
				secondary: fb.group({
					constitution: [0],
					resilience: [0],
					reflex: [0],
					charisma: [0],
				}),
			}),

			hpPerLevelBonus: [0],
			manaPerLevelBonus: [0],
		}),

		progression: fb.group({
			masteries: fb.array([] as FormControl<string>[]),
			languages: fb.array([] as FormControl<string>[]),
			skills: fb.array([]),
			languageModifier: [0],
			masteriesModifier: [0],
		}),

		story: fb.group({
			inventory: [''],
			backstory: [''],
			gold: [0],
		}),

		derived: fb.group({
			current_hp: [0],
			max_hp: [0],
			current_mana: [0],
			max_mana: [0],
		}),
	});
};

export const asFormArray = (fg: FormGroup, path: string): FormArray => fg.get(path) as FormArray;
