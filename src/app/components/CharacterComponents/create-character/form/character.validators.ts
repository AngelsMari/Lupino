import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noHtmlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const v = control.value as string;
	if (!v) return null;
	return /<.*?>/g.test(v) ? { htmlNotAllowed: true } : null;
};

export const nonNegativeFinalStatsValidator = (
	computeSecondary: (primary: {
		strength: number;
		agility: number;
		endurance: number;
		social: number;
		mental: number;
	}) => {
		constitution: number;
		resilience: number;
		reflex: number;
		charisma: number;
	},
): ValidatorFn => {
	return (group: AbstractControl): ValidationErrors | null => {
		const strength = Number(group.get('strength')?.value ?? 0);
		const agility = Number(group.get('agility')?.value ?? 0);
		const endurance = Number(group.get('endurance')?.value ?? 0);
		const social = Number(group.get('social')?.value ?? 0);
		const mental = Number(group.get('mental')?.value ?? 0);

		const primaryMods = group.get('statModifiers.primary');
		const secondaryMods = group.get('statModifiers.secondary');

		const finalPrimary = {
			strength: strength + Number(primaryMods?.get('strength')?.value ?? 0),
			agility: agility + Number(primaryMods?.get('agility')?.value ?? 0),
			endurance: endurance + Number(primaryMods?.get('endurance')?.value ?? 0),
			social: social + Number(primaryMods?.get('social')?.value ?? 0),
			mental: mental + Number(primaryMods?.get('mental')?.value ?? 0),
		};

		const negativePrimary = Object.entries(finalPrimary)
			.filter(([, value]) => value < 0)
			.map(([key]) => key);

		const secondaryBase = computeSecondary({
			strength,
			agility,
			endurance,
			social,
			mental,
		});

		const finalSecondary = {
			constitution:
				secondaryBase.constitution + Number(secondaryMods?.get('constitution')?.value ?? 0),
			resilience:
				secondaryBase.resilience + Number(secondaryMods?.get('resilience')?.value ?? 0),
			reflex: secondaryBase.reflex + Number(secondaryMods?.get('reflex')?.value ?? 0),
			charisma: secondaryBase.charisma + Number(secondaryMods?.get('charisma')?.value ?? 0),
		};

		const negativeSecondary = Object.entries(finalSecondary)
			.filter(([, value]) => value < 0)
			.map(([key]) => key);

		if (negativePrimary.length === 0 && negativeSecondary.length === 0) {
			return null;
		}

		return {
			negativeFinalStats: {
				primary: negativePrimary,
				secondary: negativeSecondary,
			},
		};
	};
};

export const nonNegativeResourcesValidator = (
	computeHpMana: (level: number, stats: any, bonuses: any) => { hp: number; mana: number },
): ValidatorFn => {
	return (group: AbstractControl): ValidationErrors | null => {
		if (!group.parent) return null;

		const basic = group.parent.get('basic');
		const statsGroup = group;

		if (!basic || !statsGroup) return null;

		const level = Number(basic.get('level')?.value ?? 1);

		const stats = {
			strength: Number(statsGroup.get('strength')?.value ?? 0),
			agility: Number(statsGroup.get('agility')?.value ?? 0),
			endurance: Number(statsGroup.get('endurance')?.value ?? 0),
			social: Number(statsGroup.get('social')?.value ?? 0),
			mental: Number(statsGroup.get('mental')?.value ?? 0),
		};

		const bonuses = {
			hpPerLevelBonus: Number(statsGroup.get('hpPerLevelBonus')?.value ?? 0),
			manaPerLevelBonus: Number(statsGroup.get('manaPerLevelBonus')?.value ?? 0),
			statModifiers: statsGroup.get('statModifiers')?.value ?? {},
		};

		const { hp, mana } = computeHpMana(level, stats, bonuses);

		if (hp >= 0 && mana >= 0) return null;

		return {
			negativeResources: {
				hp,
				mana,
			},
		};
	};
};

/**
 * Validator basé sur les valeurs du form (PAS sur une variable de component)
 * computeRemainingPoints(values) doit être fourni.
 */
export const remainingPointsValidator = (computeRemaining: (v: any) => number): ValidatorFn => {
	return (group: AbstractControl): ValidationErrors | null => {
		if (!group || !('value' in group)) return null;
		const remaining = computeRemaining((group as any).value);
		return remaining === 0 ? null : { remainingPointsInvalid: true };
	};
};

export const lineageValidator: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const kind = control.get('kind')?.value as 'pure' | 'hybrid';
	const raceId = (control.get('raceId')?.value ?? '') as string;
	const parents = (control.get('parentRaceIds')?.value ?? []) as string[];
	const chosen = (control.get('chosenBonusIds')?.value ?? []) as string[];

	if (kind === 'pure') {
		if (!raceId) return { missingRaceId: true };
		return null;
	}

	// hybrid
	if (parents.length !== 2) return { needTwoParents: true };
	if (parents[0] === parents[1]) return { parentsMustDiffer: true };
	if (chosen.length !== 2) return { needTwoBonuses: true };
	if (chosen[0] === chosen[1]) return { bonusesMustDiffer: true };

	return null;
};

export const nonNegativeCountsValidator = (
	computeCounts: (
		level: number,
		stats: {
			strength: number;
			agility: number;
			endurance: number;
			social: number;
			mental: number;
		},
		bonuses: {
			hpPerLevelBonus?: number;
			manaPerLevelBonus?: number;
			masteriesModifier?: number;
			languageModifier?: number;
			statModifiers?: any;
		},
	) => { masteries: number; languages: number; skills: number },
): ValidatorFn => {
	return (group: AbstractControl): ValidationErrors | null => {
		if (!group.parent) return null;

		const root = group.parent;

		const level = Number(root.get('basic.level')?.value ?? 1);

		const stats = {
			strength: Number(root.get('stats.strength')?.value ?? 0),
			agility: Number(root.get('stats.agility')?.value ?? 0),
			endurance: Number(root.get('stats.endurance')?.value ?? 0),
			social: Number(root.get('stats.social')?.value ?? 0),
			mental: Number(root.get('stats.mental')?.value ?? 0),
		};

		const bonuses = {
			hpPerLevelBonus: Number(root.get('stats.hpPerLevelBonus')?.value ?? 0),
			manaPerLevelBonus: Number(root.get('stats.manaPerLevelBonus')?.value ?? 0),
			masteriesModifier: Number(group.get('masteriesModifier')?.value ?? 0),
			languageModifier: Number(group.get('languageModifier')?.value ?? 0),
			statModifiers: root.get('stats.statModifiers')?.value ?? {},
		};

		const { masteries, languages } = computeCounts(level, stats, bonuses);

		if (masteries >= 0 && languages >= 0) return null;

		return {
			negativeCounts: {
				masteries,
				languages,
			},
		};
	};
};
