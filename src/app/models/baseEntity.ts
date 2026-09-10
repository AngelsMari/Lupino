import { UserPublicData } from './userPublicData';

export interface BaseEntity {
	_id: string;
	owner: UserPublicData;
	imageUrl?: string;

	name: string;
	level: number;

	current_hp: number;
	max_hp: number;
	current_mana: number;
	max_mana: number;

	strength: number;
	agility: number;
	endurance: number;
	social: number;
	mental: number;

	skills: Skill[];

	hpPerLevelBonus?: number;
	manaPerLevelBonus?: number;
	masteriesModifier?: number;
	languageModifier?: number;
	statModifiers?: StatModifiers;
}

export interface Skill {
	name: string;
	description: string;
	effects: string;
	cost: string;
}

export interface StatModifiers {
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
}
