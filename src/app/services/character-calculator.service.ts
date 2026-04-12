import { Injectable } from '@angular/core';

export type PrimaryStats = {
	strength: number;
	agility: number;
	endurance: number;
	social: number;
	mental: number;
};

export type SecondaryStats = { constitution: number; resilience: number; reflex: number; charisma: number };

export type PrimaryStatModifiers = {
	strength?: number;
	agility?: number;
	endurance?: number;
	social?: number;
	mental?: number;
};

export type SecondaryStatModifiers = {
	constitution?: number;
	resilience?: number;
	reflex?: number;
	charisma?: number;
};

export type StatModifiers = {
	primary?: PrimaryStatModifiers;
	secondary?: SecondaryStatModifiers;
};

export type CharacterBonuses = {
	hpPerLevelBonus?: number;
	manaPerLevelBonus?: number;
	masteriesModifier?: number;
	languageModifier?: number;
	statModifiers?: StatModifiers;
};

@Injectable({ providedIn: 'root' })
export class CharacterCalculatorService {
	computeAll(level: number, race: string | undefined, stats: PrimaryStats, bonuses?: CharacterBonuses) {
		const clamped = this.clampPrimaryStats(stats);
		const effectivePrimary = this.applyPrimaryModifiers(clamped, bonuses?.statModifiers);
		const secondary = this.computeSecondaryStats(clamped, bonuses?.statModifiers);
		const points = this.computeRemainingPoints(level, race, clamped);
		const counts = this.computeCounts(level, clamped, bonuses);
		const resources = this.computeHpMana(level, clamped, bonuses);

		return {
			primary: clamped,
			effectivePrimary,
			secondary,
			points,
			counts,
			resources,
		};
	}

	clampPrimaryStats(v: PrimaryStats): PrimaryStats {
		const clamp = (n: number) => Math.max(30, Math.min(Number(n ?? 30), 85));
		return {
			strength: clamp(v.strength),
			agility: clamp(v.agility),
			endurance: clamp(v.endurance),
			social: clamp(v.social),
			mental: clamp(v.mental),
		};
	}

	applyPrimaryModifiers(stats: PrimaryStats, modifiers?: StatModifiers): PrimaryStats {
		return {
			strength: stats.strength + (modifiers?.primary?.strength ?? 0),
			agility: stats.agility + (modifiers?.primary?.agility ?? 0),
			endurance: stats.endurance + (modifiers?.primary?.endurance ?? 0),
			social: stats.social + (modifiers?.primary?.social ?? 0),
			mental: stats.mental + (modifiers?.primary?.mental ?? 0),
		};
	}

	computeSecondaryStats(stats: PrimaryStats, modifiers?: StatModifiers): SecondaryStats {
		const effective = this.applyPrimaryModifiers(stats, modifiers);

		const constitution = Math.floor((effective.strength + effective.endurance) / 10) + (modifiers?.secondary?.constitution ?? 0);
		const resilience = Math.floor((effective.endurance + effective.mental) / 10) + (modifiers?.secondary?.resilience ?? 0);
		const reflex = Math.floor((effective.mental + effective.agility) / 10) + (modifiers?.secondary?.reflex ?? 0);
		const charisma =
			Math.floor((effective.social + Math.max(effective.agility, effective.strength)) / 10) + (modifiers?.secondary?.charisma ?? 0);

		return { constitution, resilience, reflex, charisma };
	}

	computeMaxPoints(level: number, race?: string): number {
		const lvl = Math.max(1, Number(level ?? 1));
		const base = race === 'Gnomes' ? 150 + 105 : 150 + 120;
		return base + Math.floor(lvl / 2) * 5;
	}

	computeRemainingPoints(level: number, race: string | undefined, stats: PrimaryStats): { remaining: number; max: number } {
		const max = this.computeMaxPoints(level, race);
		const used = stats.strength + stats.agility + stats.endurance + stats.social + stats.mental;
		return { remaining: max - used, max };
	}

	computeCounts(level: number, stats: PrimaryStats, bonuses?: CharacterBonuses) {
		const lvl = Math.max(1, Number(level ?? 1));
		const effective = this.applyPrimaryModifiers(stats, bonuses?.statModifiers);

		// Calcul de base
		let baseLang = 1;
		if (effective.social >= 40 && effective.social < 61) baseLang = 2;
		else if (effective.social >= 61) baseLang = 3;

		// ??
		let templang = 0;
		if (lvl < 3) templang = 0;
		else if (lvl < 5) templang = 1;
		else if (lvl < 7) templang = 2;
		else if (lvl < 9) templang = 3;
		else templang = 4;

		let mult = 1;
		if (effective.social <= 44) mult = 0;
		if (effective.social >= 70) mult = 2;

		const languages = Math.floor(baseLang + templang * mult) + (bonuses?.languageModifier ?? 0);

		let masteries = 12;

		if (effective.strength < 50) masteries -= 2;

		if (effective.agility < 50) masteries -= 2;
		if (effective.endurance < 50) masteries -= 2;
		if (effective.social < 50) masteries -= 2;
		if (effective.mental < 50) masteries -= 2;
		masteries += Math.floor(lvl / 2);
		masteries += bonuses?.masteriesModifier ?? 0;

		const skills = 4 + Math.floor(lvl / 2);

		return { languages, masteries, skills };
	}

	computeHpMana(level: number, stats: PrimaryStats, bonuses?: CharacterBonuses) {
		const lvl = Math.max(1, Number(level ?? 1));
		const effective = this.applyPrimaryModifiers(stats, bonuses?.statModifiers);

		let hp = Math.floor(effective.endurance / 10 + 10);
		let hpForLevelUp = 6;

		if (effective.endurance >= 70) hpForLevelUp = 10;
		else if (effective.endurance < 69 && effective.endurance >= 60) hpForLevelUp = 9;
		else if (effective.endurance < 59 && effective.endurance >= 50) hpForLevelUp = 8;
		else if (effective.endurance < 49 && effective.endurance >= 40) hpForLevelUp = 7;

		const maxStat = Math.max(effective.agility, effective.endurance, effective.strength, effective.mental, effective.social);
		if (effective.endurance === maxStat) hpForLevelUp += 1;
		const hpBonus = bonuses?.hpPerLevelBonus ?? 0;

		hp += hpBonus;
		hpForLevelUp += hpBonus ?? 0;
		hp += (lvl - 1) * hpForLevelUp;

		let mana = Math.floor((effective.mental + maxStat) / 10);
		let manaForLevelUp = 4;

		if (effective.mental >= 70) manaForLevelUp = 8;
		else if (effective.mental >= 60 && effective.mental < 69) manaForLevelUp = 7;
		else if (effective.mental >= 50 && effective.mental < 59) manaForLevelUp = 6;
		else if (effective.mental >= 40 && effective.mental < 49) manaForLevelUp = 5;

		if (effective.mental === maxStat) manaForLevelUp += 1;

		manaForLevelUp += bonuses?.manaPerLevelBonus ?? 0;
		mana += (lvl - 1) * manaForLevelUp;

		return { hp, mana };
	}
}
