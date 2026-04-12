export interface Race {
	_id: string;
	name: string;
	type: string;
	image?: string;
	description: string;
	bonuses: RaceBonus[];
}

export interface RaceBonus {
	_id: string;
	slot: BonusSlot;
	value: string;
}

export type BonusSlot = 'corps' | 'membre' | 'aura' | 'carrure' | 'yeux';
