import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../../models/character';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-character-card',
    templateUrl: './character-card.component.html',
    styleUrl: './character-card.component.css',
    imports: [NgClass, RouterLink],
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
