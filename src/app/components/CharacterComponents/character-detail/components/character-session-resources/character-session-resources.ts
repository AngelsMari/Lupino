import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../../../../models/character';

@Component({
	selector: 'app-character-session-resources',
	standalone: true,
	imports: [],
	templateUrl: './character-session-resources.html',
	styleUrl: './character-session-resources.css',
})
export class CharacterSessionResourcesComponent {
	@Input({ required: true }) character!: Character;

	@Output() modifyHp = new EventEmitter<number | 'max'>();
	@Output() modifyMana = new EventEmitter<number | 'max'>();

	get hpPercent(): number {
		if (!this.character?.max_hp) return 0;
		return Math.max(
			0,
			Math.min(100, (this.character.current_hp / this.character.max_hp) * 100),
		);
	}

	get manaPercent(): number {
		if (!this.character?.max_mana) return 0;
		return Math.max(
			0,
			Math.min(100, (this.character.current_mana / this.character.max_mana) * 100),
		);
	}
}
