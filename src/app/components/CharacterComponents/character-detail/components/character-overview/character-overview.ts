import { Component, Input } from '@angular/core';
import { Character } from '../../../../../models/character';

export interface LineageDisplay {
	raceNames: string[];
	bonuses: {
		_id: string;
		slot: string;
		value: string;
	}[];
}

@Component({
	selector: 'app-character-overview',
	standalone: true,
	templateUrl: './character-overview.html',
	styleUrl: './character-overview.css',
})
export class CharacterOverviewComponent {
	@Input({ required: true }) character!: Character;
	@Input() lineage?: LineageDisplay | null;
}
