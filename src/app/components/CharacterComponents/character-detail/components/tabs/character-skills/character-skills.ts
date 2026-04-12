import { Component, Input } from '@angular/core';
import { Character } from '../../../../../../models/character';

@Component({
	selector: 'app-character-skills',
	imports: [],
	templateUrl: './character-skills.html',
	styleUrl: './character-skills.css',
})
export class CharacterSkills {
	@Input() character?: Character;
}
