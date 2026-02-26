import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
	selector: 'app-character-card',
	standalone: false,
	templateUrl: './character-card.component.html',
	styleUrl: './character-card.component.css',
})
export class CharacterCardComponent {
	@Input() character!: Character;

	@Input() isMyCharacterPage = false;
	@Input() isAdmin = false;

	@Output() delete = new EventEmitter<Character>();

	onDelete() {
		this.delete.emit(this.character);
	}
}
