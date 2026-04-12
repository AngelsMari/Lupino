import { Component, Input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Race, RaceBonus } from '../../../../../models/race';

@Component({
	selector: 'app-step-2-race',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './step-2-race.html',
	styleUrls: ['./step-2-race.css'],
})
export class Step2Race {
	@Input({ required: true }) form!: FormGroup;

	@Input() commonRaces: Race[] = [];
	@Input() exoticRaces: Race[] = [];

	availableBonuses: RaceBonus[] = [];

	isExoticVisible = signal(false);

	ngOnInit() {
		this.form.get('kind')?.valueChanges.subscribe((kind) => {
			if (kind === 'pure') {
				this.form.patchValue({ parentRaceIds: [], chosenBonusIds: [] }, { emitEvent: false });
			} else {
				this.form.patchValue({ raceId: '' }, { emitEvent: false });
			}
			this.rebuildAvailableBonuses();
		});

		// rebuild quand raceId change (pure)
		this.form.get('raceId')?.valueChanges.subscribe(() => {
			this.form.get('chosenBonusIds')?.setValue([]);
			this.rebuildAvailableBonuses();
		});

		// rebuild quand parents changent (hybrid)
		this.form.get('parentRaceIds')?.valueChanges.subscribe(() => {
			//this.form.get('chosenBonusIds')?.setValue([]);
			this.rebuildAvailableBonuses();
		});

		// init
		this.rebuildAvailableBonuses();
	}
	private rebuildAvailableBonuses() {
		const kind = this.form.get('kind')?.value;

		const allRaces = [...this.commonRaces, ...this.exoticRaces];

		if (kind === 'pure') {
			const raceId = this.form.get('raceId')?.value as string;
			const race = allRaces.find((r) => r._id === raceId);
			this.availableBonuses = (race?.bonuses ?? []).slice(0, 2); // en théorie déjà max 2
			return;
		}

		const parents = (this.form.get('parentRaceIds')?.value ?? []) as string[];
		if (parents.length !== 2) {
			this.availableBonuses = [];
			return;
		}

		const raceA = allRaces.find((r) => r._id === parents[0]);
		const raceB = allRaces.find((r) => r._id === parents[1]);

		const bonuses = [...(raceA?.bonuses ?? []), ...(raceB?.bonuses ?? [])];

		// dédoublonnage si jamais un bonus aurait le même _id (rare mais safe)
		const map = new Map<string, RaceBonus>();
		bonuses.forEach((b) => map.set(b._id, b));
		this.availableBonuses = [...map.values()].slice(0, 4);
	}

	isSelected(raceId: string): boolean {
		const kind = this.form.get('kind')?.value;
		if (kind === 'pure') {
			return this.form.get('raceId')?.value === raceId;
		}
		const parents = (this.form.get('parentRaceIds')?.value ?? []) as string[];
		return parents.includes(raceId);
	}

	get selectedBonusIds(): string[] {
		return (this.form.get('chosenBonusIds')?.value ?? []) as string[];
	}

	onSelectRace(race: Race) {
		const kind = this.form.get('kind')?.value;

		if (kind === 'pure') {
			this.form.patchValue(
				{
					raceId: race._id,
					parentRaceIds: [],
					chosenBonusIds: [],
				},
				{ emitEvent: true },
			);

			this.rebuildAvailableBonuses();
			this.form.updateValueAndValidity({ emitEvent: true });
			return;
		}

		const ctrl = this.form.get('parentRaceIds');
		const current = [...((ctrl?.value ?? []) as string[])];

		let next: string[];

		// toggle off
		if (current.includes(race._id)) {
			next = current.filter((id) => id !== race._id);
		}
		// add if room
		else if (current.length < 2) {
			next = [...current, race._id];
		}
		// replace oldest if already 2
		else {
			next = [current[1], race._id];
		}

		this.form.patchValue(
			{
				parentRaceIds: next,
				chosenBonusIds: [],
			},
			{ emitEvent: true },
		);

		this.rebuildAvailableBonuses();
		this.form.updateValueAndValidity({ emitEvent: true });
	}

	isBonusSelected(bonusId: string): boolean {
		return this.selectedBonusIds.includes(bonusId);
	}

	toggleBonus(b: RaceBonus) {
		const ctrl = this.form.get('chosenBonusIds');
		const current = [...this.selectedBonusIds];

		const idx = current.indexOf(b._id);

		// décocher
		if (idx >= 0) {
			current.splice(idx, 1);
			ctrl?.setValue(current);
			return;
		}

		// si déjà 2 → ignore (ou remplace le plus ancien si tu préfères)
		if (current.length >= 2) return;

		// règle slots uniques (si un bonus sélectionné a le même slot)
		const selectedBonuses = this.availableBonuses.filter((x) => current.includes(x._id));
		if (selectedBonuses.some((x) => x.slot === b.slot)) return;

		current.push(b._id);
		console.log(current);
		ctrl?.setValue(current);
	}

	isBonusDisabled(b: RaceBonus): boolean {
		// si déjà sélectionné, jamais disabled
		if (this.isBonusSelected(b._id)) return false;

		// si déjà 2 sélectionnés, le reste disabled
		if (this.selectedBonusIds.length >= 2) return true;

		// si slot déjà pris, disabled
		const selectedBonuses = this.availableBonuses.filter((x) => this.selectedBonusIds.includes(x._id));
		return selectedBonuses.some((x) => x.slot === b.slot);
	}

	toggleExoticVisibility() {
		this.isExoticVisible.update((v: boolean) => !v);
	}
}
