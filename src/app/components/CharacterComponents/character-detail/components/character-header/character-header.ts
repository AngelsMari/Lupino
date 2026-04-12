import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Character } from '../../../../../models/character';
import { UserPublicData } from '../../../../../models/userpublicdata';

@Component({
	selector: 'app-character-header',
	standalone: true,
	imports: [NgClass],
	templateUrl: './character-header.html',
	styleUrl: './character-header.css',
})
export class CharacterHeaderComponent {
	@Input({ required: true }) character!: Character;
	@Input() currentUser?: UserPublicData | null;
	@Input() sessionActive = false;

	@Output() edit = new EventEmitter<void>();
	@Output() toggleVisibility = new EventEmitter<void>();
	@Output() startSession = new EventEmitter<void>();
	@Output() endSession = new EventEmitter<void>();

	get isOwner(): boolean {
		return this.currentUser?._id === this.character?.owner?._id;
	}

	onToggleVisibilityClick() {
		this.toggleVisibility.emit();
	}
}
