import { BonusSlot } from './race';
import { BaseEntity } from './baseEntity';

export interface BonusSnapshot {
	_id: string;
	slot: BonusSlot;
	value: string;
	sourceRaceId: string;
}

export type Lineage =
	| {
			kind: 'pure';
			raceId: string;
			appliedBonuses: BonusSnapshot[];
	  }
	| {
			kind: 'hybrid';
			parentRaceIds: [string, string];
			appliedBonuses: BonusSnapshot[];
	  };

// character.model.ts
export interface Character extends BaseEntity {
	isPNJ: boolean;
	type: string;
	lien: string;

	age: string;

	positive_trait: string;
	negative_trait: string;

	race: string; // Ancien modèle
	lineage: Lineage;

	skincolor: string;
	height: string;
	weight: string;
	sexe: string;
	eyes: string;
	hair: string;

	inventory: string;
	backstory: string;
	gold: number;
	masteries: string[];
	languages: string[];

	isPublic: boolean;
}
