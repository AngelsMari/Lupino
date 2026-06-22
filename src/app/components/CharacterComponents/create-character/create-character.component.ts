import {
	Component,
	computed,
	effect,
	inject,
	Injector,
	runInInjectionContext,
	signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { RaceService } from '../../../services/LupinoApi/race.service';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { ToastrService } from 'ngx-toastr';
import DOMPurify from 'dompurify';

import { asFormArray, createCharacterForm } from './form/character-form.factory';
import {
	nonNegativeCountsValidator,
	nonNegativeFinalStatsValidator,
	nonNegativeResourcesValidator,
	remainingPointsValidator,
} from './form/character.validators';
import {
	CharacterCalculatorService,
	PrimaryStats,
} from '../../../services/character-calculator.service';

import { WizardNavComponent } from './steps/wizard-nav/wizard-nav';
import { Step1Basic } from './steps/step-1-basic/step-1-basic';
import { Step2Race } from './steps/step-2-race/step-2-race';
import { Step3Stats } from './steps/step-3-stats/step-3-stats';
import { Step4Masteries } from './steps/step-4-masteries/step-4-masteries';
import { Step5Skills } from './steps/step-5-skills/step-5-skills';
import { Step6Inventory } from './steps/step-6-inventory/step-6-inventory';
import { Step7Backstory } from './steps/step-7-backstory/step-7-backstory';
import { Race } from '../../../models/race';

type StatModifiers = {
	primary?: {
		strength?: number;
		agility?: number;
		endurance?: number;
		social?: number;
		mental?: number;
	};
	secondary?: {
		constitution?: number;
		resilience?: number;
		reflex?: number;
		charisma?: number;
	};
};
type CalcInputs = {
	level: number;
	race?: string;
	stats: PrimaryStats;
	bonuses: {
		hpPerLevelBonus?: number;
		manaPerLevelBonus?: number;
		masteriesModifier?: number;
		languageModifier?: number;
		statModifiers?: StatModifiers;
	};
};

@Component({
	selector: 'app-create-character',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		WizardNavComponent,
		Step1Basic,
		Step2Race,
		Step3Stats,
		Step4Masteries,
		Step5Skills,
		Step6Inventory,
		Step7Backstory,
	],
	templateUrl: './create-character.component.html',
	styleUrls: ['./create-character.component.css'],
})
export class CreateCharacterComponent {
	private injector = inject(Injector);
	// -----------------------
	step = signal(1);
	readonly maxStep = 7;
	commonRaces = signal<Race[]>([]);
	exoticRaces = signal<Race[]>([]);
	isLegacy = signal(false);

	private fb = inject(FormBuilder);
	characterForm: FormGroup = createCharacterForm(this.fb);
	public formStatus = toSignal(
		merge(
			this.characterForm.statusChanges,
			this.characterForm.valueChanges.pipe(map(() => this.characterForm.status)),
		).pipe(startWith(this.characterForm.status)),
		{ initialValue: this.characterForm.status },
	);
	public canSubmit = computed(() => this.formStatus() === 'VALID' && !this.isHydrating());
	private calc = inject(CharacterCalculatorService);
	private raceService = inject(RaceService);

	private isHydrating = signal(false);

	// -----------------------
	// Wizard state (signals)
	private characterService = inject(CharacterService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	// -----------------------
	characterId = signal<string | null>(this.route.snapshot.paramMap.get('id'));
	private toastr = inject(ToastrService);
	// Helpers (typed-ish)
	private basicFg = this.characterForm.get('basic') as FormGroup;
	private raceFg = this.characterForm.get('race') as FormGroup;
	// Calc inputs as signal (sans Quill)
	private statsFg = this.characterForm.get('stats') as FormGroup;
	// Derived (computed)
	private progressionFg = this.characterForm.get('progression') as FormGroup;
	private storyFg = this.characterForm.get('story') as FormGroup;
	// -----------------------
	private lastSizes = signal({ masteries: -1, languages: -1, skills: -1 });

	// -----------------------
	// -----------------------
	private calcInputs = toSignal(
		merge(
			this.basicFg.get('level')!.valueChanges,
			this.raceFg.valueChanges,
			this.statsFg.valueChanges,
			this.progressionFg.get('masteriesModifier')!.valueChanges,
			this.progressionFg.get('languageModifier')!.valueChanges,
		).pipe(
			startWith(null),
			map(() => this.snapshotCalcInputs()),
		),
		{ initialValue: this.snapshotCalcInputs() },
	);
	// -----------------------
	clampedStats = computed<PrimaryStats>(() =>
		this.calc.clampPrimaryStats(this.calcInputs().stats),
	);
	secondaryStats = computed(() => {
		const i = this.calcInputs();
		return this.calc.computeSecondaryStats(this.clampedStats(), i.bonuses.statModifiers);
	});
	remainingPack = computed(() => {
		const i = this.calcInputs();
		return this.calc.computeRemainingPoints(i.level, i.race, this.clampedStats());
	});
	remainingPoints = computed(() => this.remainingPack().remaining);
	// -----------------------
	maximumPoints = computed(() => this.remainingPack().max);
	counts = computed(() => {
		const i = this.calcInputs();
		return this.calc.computeCounts(i.level, this.clampedStats(), i.bonuses);
	});

	resources = computed(() => {
		const i = this.calcInputs();
		return this.calc.computeHpMana(i.level, this.clampedStats(), i.bonuses);
	});
	private effectsInitialized = false;

	constructor() {
		// races
		this.raceService.getRaces().subscribe((races: any[]) => {
			this.commonRaces.set(races.filter((r) => r.type === 'commune'));
			this.exoticRaces.set(races.filter((r) => r.type === 'inhabituelle'));
		});

		// edit
		const id = this.characterId();
		if (id) this.loadCharacter(id);

		this.statsFg.setValidators(remainingPointsValidator(() => this.remainingPoints()));
		this.statsFg.addValidators(
			nonNegativeFinalStatsValidator((primary) => this.calc.computeSecondaryStats(primary)),
		);
		this.statsFg.addValidators(
			nonNegativeResourcesValidator((level, stats, bonuses) =>
				this.calc.computeHpMana(level, stats, bonuses),
			),
		);

		this.progressionFg.addValidators(
			nonNegativeCountsValidator((level, stats, bonuses) =>
				this.calc.computeCounts(level, stats, bonuses),
			),
		);
		this.progressionFg.updateValueAndValidity();

		// Effects (side effects)
		if (!id) {
			this.setupEffects();
		}
	}

	// -----------------------
	// UI actions

	get basicGroup(): FormGroup {
		return this.characterForm.get('basic') as FormGroup;
	}

	get metaGroup(): FormGroup {
		return this.characterForm.get('meta') as FormGroup;
	}

	get raceGroup(): FormGroup {
		return this.characterForm.get('race') as FormGroup;
	}

	get statsGroup(): FormGroup {
		return this.characterForm.get('stats') as FormGroup;
	}

	get progressionGroup(): FormGroup {
		return this.characterForm.get('progression') as FormGroup;
	}

	get storyGroup(): FormGroup {
		return this.characterForm.get('story') as FormGroup;
	}

	nextStep() {
		if (this.step() < this.maxStep) this.step.update((s) => s + 1);
	}

	previousStep() {
		if (this.step() > 1) this.step.update((s) => s - 1);
	}

	// -----------------------
	// Submit
	submit() {
		this.characterForm.markAllAsTouched();
		if (this.characterForm.invalid) {
			console.log('FORM INVALID', {
				status: this.characterForm.status,
				errors: this.characterForm.errors,
			});
			this.logInvalidControls(this.characterForm);

			this.toastr.error('Formulaire invalide');
			return;
		}

		const payload = this.buildFlatPayloadFromForm();
		const id = this.characterId();

		if (id) {
			payload._id = id;
			this.characterService.updateCharacter(payload).subscribe(() => {
				this.router.navigate(['/character', id]);
			});
		} else {
			delete payload._id;
			this.characterService.createCharacter(payload).subscribe(() => {
				this.router.navigate(['/mycharacters']);
			});
		}
	}

	private logInvalidControls(fg: any, path = ''): void {
		if (!fg) return;

		// FormControl
		if (fg.controls === undefined) {
			if (fg.invalid) {
				console.log(`❌ INVALID control: ${path}`, {
					value: fg.value,
					errors: fg.errors,
					status: fg.status,
					touched: fg.touched,
					dirty: fg.dirty,
				});
			}
			return;
		}

		// FormGroup / FormArray
		const controls = fg.controls;
		Object.keys(controls).forEach((key) => {
			const c = controls[key];
			const p = path ? `${path}.${key}` : key;

			if (c.invalid) {
				// log group/array errors too
				if (c.errors) {
					console.log(`❌ INVALID group/array: ${p}`, {
						errors: c.errors,
						status: c.status,
					});
				}
				this.logInvalidControls(c, p);
			}
		});
	}

	// -----------------------
	// Effects

	// -----------------------
	private ensureEffectsInitialized() {
		if (this.effectsInitialized) return;
		this.setupEffects();
		this.effectsInitialized = true;
	}
	// -----------------------
	private setupEffects() {
		runInInjectionContext(this.injector, () => {
			effect(
				() => {
					this.calcInputs();
					this.progressionFg.updateValueAndValidity({ emitEvent: false, onlySelf: true });
				},
				{ allowSignalWrites: true },
			);
			effect(
				() => {
					if (this.isHydrating()) return;

					const c = this.counts();
					const prev = this.lastSizes();

					const masteries = Math.max(0, c.masteries);
					const languages = Math.max(0, c.languages);
					const skills = Math.max(0, c.skills);

					if (masteries !== prev.masteries) {
						this.resizeSimpleArray('progression.masteries', masteries);
					}

					if (languages !== prev.languages) {
						this.resizeSimpleArray('progression.languages', languages);
					}

					if (skills !== prev.skills) {
						this.resizeSkillsArray(skills);
					}

					if (
						masteries !== prev.masteries ||
						languages !== prev.languages ||
						skills !== prev.skills
					) {
						this.lastSizes.set({
							masteries,
							languages,
							skills,
						});
					}
				},
				{ allowSignalWrites: true },
			);

			// 3) Refresh validity of stats group only (validator remaining points)
			effect(
				() => {
					this.remainingPoints();
					this.statsFg.updateValueAndValidity({ emitEvent: true, onlySelf: true });
					this.characterForm.updateValueAndValidity({ emitEvent: true });
				},
				{ allowSignalWrites: true },
			);
		});
	}

	private resizeSimpleArray(path: string, desired: number) {
		const safeDesired = Math.max(0, desired);
		const arr = asFormArray(this.characterForm, path);

		while (arr.length > safeDesired) arr.removeAt(arr.length - 1);
		while (arr.length < safeDesired) arr.push(this.fb.control('-', [Validators.required]));
	}

	private resizeSkillsArray(desired: number) {
		const safeDesired = Math.max(0, desired);
		const arr = asFormArray(this.characterForm, 'progression.skills');

		const isEditing = !!this.characterId();
		const target = isEditing ? Math.max(safeDesired, arr.length) : safeDesired;

		while (arr.length > target) arr.removeAt(arr.length - 1);
		while (arr.length < target) {
			arr.push(
				this.fb.group({
					name: ['-', Validators.required],
					description: ['-', Validators.required],
					effects: ['-', Validators.required],
					cost: ['-', Validators.required],
				}),
			);
		}
	}

	private snapshotCalcInputs(): CalcInputs {
		const level = Number(this.basicFg.get('level')?.value ?? 1);
		const v: any = this.statsFg.getRawValue();
		const progressionValue: any = this.progressionFg.getRawValue();

		let result = {
			level: Math.max(1, Number(level ?? 1)),
			race: undefined,
			stats: {
				strength: Number(v.strength ?? 30),
				agility: Number(v.agility ?? 30),
				endurance: Number(v.endurance ?? 30),
				social: Number(v.social ?? 30),
				mental: Number(v.mental ?? 30),
			},
			bonuses: {
				hpPerLevelBonus: Number(v.hpPerLevelBonus ?? 0),
				manaPerLevelBonus: Number(v.manaPerLevelBonus ?? 0),
				masteriesModifier: Number(progressionValue.masteriesModifier ?? 0),
				languageModifier: Number(progressionValue.languageModifier ?? 0),
				statModifiers: v.statModifiers ?? {},
			},
		};

		return result;
	}

	private sanitizeQuill(input: string): string {
		let clean = DOMPurify.sanitize(input || '', {
			ALLOWED_TAGS: [
				'b',
				'i',
				'strong',
				'ul',
				'li',
				'p',
				'span',
				'em',
				'u',
				's',
				'blockquote',
				'h1',
				'h2',
				'h3',
				'sub',
				'sup',
			],
			ALLOWED_ATTR: ['style', 'class'],
			FORBID_TAGS: ['script', 'iframe', 'object'],
		});

		clean = clean.replace(/style="([^"]*)"/g, (_m, styleContent) => {
			const colorMatch = String(styleContent).match(/color\s*:\s*[^;]+/i);
			return colorMatch ? `style="${colorMatch[0]}"` : '';
		});

		clean = clean.replace(/<p>\s*<\/p>/g, '').replace(/&nbsp;/g, ' ');
		return clean;
	}

	private loadCharacter(id: string) {
		this.isHydrating.set(true);

		this.characterService.getCharacterById(id).subscribe((dto) => {
			this.isLegacy.set(!!dto.race && !dto.lineage);
			this.patchFromFlatCharacter(dto);
			this.step.set(1);
			this.lastSizes.set({
				masteries: asFormArray(this.characterForm, 'progression.masteries').length,
				languages: asFormArray(this.characterForm, 'progression.languages').length,
				skills: asFormArray(this.characterForm, 'progression.skills').length,
			});
			console.log(this.canSubmit());
			this.ensureEffectsInitialized();

			this.basicFg.updateValueAndValidity({ emitEvent: true });
			this.raceFg.updateValueAndValidity({ emitEvent: true });
			this.statsFg.updateValueAndValidity({ emitEvent: true });
			this.progressionFg.updateValueAndValidity({ emitEvent: true });
			this.storyFg.updateValueAndValidity({ emitEvent: true });
			this.characterForm.updateValueAndValidity({ emitEvent: true });
			this.isHydrating.set(false);
		});
	}

	private patchFromFlatCharacter(dto: any) {
		// Patch des groupes simples
		const allRaces = [...this.commonRaces(), ...this.exoticRaces()];
		const legacyRaceId = allRaces.find((r) => r.name === dto.race)?._id ?? '';
		const lineage = dto.lineage
			? {
					kind: dto.lineage.kind ?? 'pure',
					raceId: dto.lineage.raceId ?? '',
					parentRaceIds: dto.lineage.parentRaceIds ?? [],
					chosenBonusIds: dto.lineage.chosenBonusIds ?? [],
				}
			: {
					kind: 'pure',
					raceId: legacyRaceId,
					parentRaceIds: [],
					chosenBonusIds: [],
				};
		this.characterForm.patchValue(
			{
				meta: {
					_id: dto._id ?? '',
					imageUrl: dto.imageUrl ?? '',
					isPNJ: dto.isPNJ ?? false,
				},
				basic: {
					name: dto.name ?? '',
					level: dto.level ?? 1,
					age: dto.age ?? '',
					skincolor: dto.skincolor ?? '',
					height: dto.height ?? '',
					weight: dto.weight ?? '',
					sexe: dto.sexe ?? '',
					eyes: dto.eyes ?? '',
					hair: dto.hair ?? '',
					positive_trait: dto.positive_trait ?? '',
					negative_trait: dto.negative_trait ?? '',
				},
				race: lineage,
				stats: {
					strength: dto.strength ?? 30,
					agility: dto.agility ?? 30,
					endurance: dto.endurance ?? 30,
					social: dto.social ?? 30,
					mental: dto.mental ?? 30,
					statModifiers: {
						primary: {
							strength: dto.statModifiers?.primary?.strength ?? 0,
							agility: dto.statModifiers?.primary?.agility ?? 0,
							endurance: dto.statModifiers?.primary?.endurance ?? 0,
							social: dto.statModifiers?.primary?.social ?? 0,
							mental: dto.statModifiers?.primary?.mental ?? 0,
						},
						secondary: {
							constitution: dto.statModifiers?.secondary?.constitution ?? 0,
							resilience: dto.statModifiers?.secondary?.resilience ?? 0,
							reflex: dto.statModifiers?.secondary?.reflex ?? 0,
							charisma: dto.statModifiers?.secondary?.charisma ?? 0,
						},
					},
					hpPerLevelBonus: dto.hpPerLevelBonus ?? 0,
					manaPerLevelBonus: dto.manaPerLevelBonus ?? 0,
				},
				progression: {
					masteriesModifier: dto.masteriesModifier ?? 0,
					languageModifier: dto.languageModifier ?? 0,
				},
				story: {
					inventory: dto.inventory ?? '',
					backstory: dto.backstory ?? '',
					gold: dto.gold ?? 0,
				},
				derived: {
					current_hp: dto.current_hp ?? 0,
					max_hp: dto.max_hp ?? 0,
					current_mana: dto.current_mana ?? 0,
					max_mana: dto.max_mana ?? 0,
				},
			},
			{ emitEvent: true },
		);
		// Patch des arrays
		this.patchArraysFromFlat(dto);
	}

	private patchArraysFromFlat(dto: any) {
		const masteries = Array.isArray(dto.masteries) ? dto.masteries : [];
		const languages = Array.isArray(dto.languages) ? dto.languages : [];
		const skills = Array.isArray(dto.skills) ? dto.skills : [];

		const mArr = asFormArray(this.characterForm, 'progression.masteries');
		const lArr = asFormArray(this.characterForm, 'progression.languages');
		const sArr = asFormArray(this.characterForm, 'progression.skills');

		// clear() existe sur FormArray Angular récent; si tu préfères:
		// while(arr.length) arr.removeAt(0)
		mArr.clear();
		lArr.clear();
		sArr.clear();

		for (const m of masteries) mArr.push(this.fb.control(m ?? '', Validators.required));
		for (const l of languages) lArr.push(this.fb.control(l ?? '', Validators.required));

		for (const sk of skills) {
			sArr.push(
				this.fb.group({
					name: [sk?.name ?? '', Validators.required],
					description: [sk?.description ?? '', Validators.required],
					effects: [sk?.effects ?? '', Validators.required],
					cost: [sk?.cost ?? '', Validators.required],
				}),
			);
		}

		// Important: sync le cache de tailles pour éviter qu’un effect resize “écrase” ce qu’on vient de patch
		this.lastSizes.set({ masteries: mArr.length, languages: lArr.length, skills: sArr.length });
	}

	private buildFlatPayloadFromForm(): any {
		const raw: any = this.characterForm.getRawValue();

		const stats = this.clampedStats();
		const level = Number(raw.basic?.level ?? 1);
		const bonuses = {
			hpPerLevelBonus: Number(raw.stats?.hpPerLevelBonus ?? 0),
			manaPerLevelBonus: Number(raw.stats?.manaPerLevelBonus ?? 0),
			masteriesModifier: Number(raw.progression?.masteriesModifier ?? 0),
			languageModifier: Number(raw.progression?.languageModifier ?? 0),
			statModifiers: raw.stats?.statModifiers ?? {},
		};

		const { hp, mana } = this.calc.computeHpMana(level, stats, bonuses);

		// lineage (nouveau)
		const lineage = {
			kind: raw.race?.kind ?? 'pure',
			raceId: raw.race?.raceId ?? '',
			parentRaceIds: raw.race?.parentRaceIds ?? [],
			chosenBonusIds: raw.race?.chosenBonusIds ?? [],
		};

		// si on édite un ancien perso -> on demande au back d'effacer le champ race legacy
		const legacy = this.isLegacy();

		const payload: any = {
			// meta
			_id: raw.meta?._id || undefined,
			imageUrl: raw.meta?.imageUrl ?? '',
			isPNJ: raw.meta?.isPNJ ?? false,

			// basic
			name: raw.basic?.name ?? '',
			level,
			age: raw.basic?.age ?? '',
			skincolor: raw.basic?.skincolor ?? '',
			height: raw.basic?.height ?? '',
			weight: raw.basic?.weight ?? '',
			sexe: raw.basic?.sexe ?? '',
			eyes: raw.basic?.eyes ?? '',
			hair: raw.basic?.hair ?? '',
			positive_trait: raw.basic?.positive_trait ?? '',
			negative_trait: raw.basic?.negative_trait ?? '',

			// ✅ nouveau système
			lineage,

			// stats
			...stats,
			hpPerLevelBonus: bonuses.hpPerLevelBonus,
			manaPerLevelBonus: bonuses.manaPerLevelBonus,
			masteriesModifier: bonuses.masteriesModifier,
			languageModifier: bonuses.languageModifier,
			statModifiers: bonuses.statModifiers,

			// arrays
			masteries: raw.progression?.masteries ?? [],
			languages: raw.progression?.languages ?? [],
			skills: raw.progression?.skills ?? [],

			// story
			inventory: this.sanitizeQuill(raw.story?.inventory),
			backstory: this.sanitizeQuill(raw.story?.backstory),
			gold: raw.story?.gold ?? 0,

			// derived
			current_hp: hp,
			max_hp: hp,
			current_mana: mana,
			max_mana: mana,
		};

		if (legacy) {
			payload.clearLegacyRace = true;
		}
		console.log('payload');
		console.log(payload);

		return payload;
	}

	getAllErrors(): string[] {
		return this.buildErrorList(this.characterForm);
	}

	private buildErrorList(control: any, path = ''): string[] {
		let messages: string[] = [];

		if (!control) return messages;

		// erreurs du control/groupe courant
		if (control.errors) {
			messages.push(...this.mapErrors(path, control.errors));
		}

		// si pas de children → stop
		if (!control.controls) return messages;

		// FormGroup / FormArray
		for (const key of Object.keys(control.controls)) {
			const child = control.controls[key];
			const childPath = path ? `${path}.${key}` : key;
			messages.push(...this.buildErrorList(child, childPath));
		}

		return messages;
	}

	private humanize(path: string): string {
		const map: Record<string, string> = {
			'basic.name': 'Le nom',
			'basic.level': 'Le niveau',
			'basic.positive_trait': 'Le trait positif',
			'basic.negative_trait': 'Le trait négatif',

			'stats.strength': 'La force',
			'stats.agility': 'L’agilité',
			'stats.endurance': 'L’endurance',
			'stats.social': 'Le social',
			'stats.mental': 'Le mental',

			race: 'La race',
		};

		return map[path] || path;
	}

	private mapErrors(path: string, errors: any): string[] {
		const messages: string[] = [];
		const field = this.humanize(path);

		if (errors['required']) {
			messages.push(`${field} est requis`);
		}

		if (errors['min']) {
			messages.push(`${field} est trop petit`);
		}

		if (errors['max']) {
			messages.push(`${field} est trop grand`);
		}

		if (errors['htmlNotAllowed']) {
			messages.push(`${field} contient du HTML interdit`);
		}

		if (errors['remainingPointsInvalid']) {
			messages.push(`Les points de caractéristiques doivent être exactement à 0`);
		}

		if (errors['missingRaceId']) {
			messages.push(`Une race doit être sélectionnée`);
		}

		if (errors['needTwoParents']) {
			messages.push(`Un hybride doit avoir exactement 2 races parentes`);
		}

		if (errors['parentsMustDiffer']) {
			messages.push(`Les races parentes doivent être différentes`);
		}

		if (errors['needTwoBonuses']) {
			messages.push(`Un hybride doit choisir exactement 2 bonus`);
		}

		if (errors['bonusesMustDiffer']) {
			messages.push(`Les bonus choisis doivent être différents`);
		}

		return messages;
	}
}
