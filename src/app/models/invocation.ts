import { Character } from './character';
import { BestiaryEntry } from './bestiaryEntry';
import { BaseEntity } from './baseEntity';

export interface Invocation extends BaseEntity {
	characterLinked: Character;

	size: InvocationSize;

	bestiaryEntry: BestiaryEntry;

	manaCost: number;

	positive_trait: string;
	negative_trait: string;
}

export type InvocationSize = 'small' | 'medium' | 'large';
