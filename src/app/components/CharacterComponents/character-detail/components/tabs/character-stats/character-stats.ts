import { Component, Input } from '@angular/core';
import { Character } from '../../../../../../models/character';

@Component({
	selector: 'app-character-stats',
	imports: [],
	templateUrl: './character-stats.html',
	styleUrl: './character-stats.css',
})
export class CharacterStats {
	@Input({ required: true }) character!: Character;
	@Input() primaryStats?: {
		strength: number;
		agility: number;
		endurance: number;
		social: number;
		mental: number;
	} | null;

	@Input() secondaryStats?: {
		constitution: number;
		resilience: number;
		reflex: number;
		charisma: number;
	} | null;

	@Input() bonuses?: {
		strength?: string;
		agility?: string;
		endurance?: string;
		social?: string;
		mental?: string;
	} | null;
}
