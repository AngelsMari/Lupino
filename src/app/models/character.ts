import { UserPublicData } from './userpublicdata';
import { BonusSlot } from './race';

export interface BonusSnapshot {
	_id: string;
	slot: BonusSlot;
	value: string;
	sourceRaceId: string;
}

export type Lineage =
	| {
			kind: 'pure';
			raceId: string; // la race choisie
			appliedBonuses: BonusSnapshot[]; // snapshot des bonus appliqués
	  }
	| {
			kind: 'hybrid';
			parentRaceIds: [string, string];
			appliedBonuses: BonusSnapshot[]; // exactement 2, slots uniques
	  };

// character.model.ts
export interface Character {
	_id: string;
	owner: UserPublicData;
	imageUrl: string;
	isPNJ: boolean;
	type: string; //ENUM à venir ['Jouable', 'PNJ', 'Monstre', 'Monture', 'Invoc']
	lien: string;
	name: string;
	age: string;
	level: number;

	race: string; // Ancien modèle
	lineage: Lineage;

	skincolor: string;
	height: string;
	weight: string;
	sexe: string;
	eyes: string;
	hair: string;
	current_hp: number;
	max_hp: number;
	current_mana: number;
	max_mana: number;
	strength: number;
	agility: number;
	endurance: number;
	social: number;
	mental: number;
	positive_trait: string;
	negative_trait: string;
	skills: Skill[];
	inventory: string;
	backstory: string;
	gold: number;
	masteries: string[];
	languages: string[];
	isPublic: boolean;

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
