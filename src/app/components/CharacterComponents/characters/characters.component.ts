import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, filter, map, shareReplay, switchMap, tap } from 'rxjs';

import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { UserPublicData } from 'app/models/userpublicdata';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrl: './characters.component.css',
    standalone: false
})
export class CharactersComponent {
	characters$ = combineLatest([
		this.userService.getUserData().pipe(filter(Boolean)), // s'assure que l'utilisateur est chargé
		this.router.url === '/mycharacters'
			? this.userService.getUserData().pipe(
					filter(Boolean),
					switchMap((user) => this.characterService.getCharactersByUser(user._id)),
					map((res) => res),
			  )
			: this.characterService.getCharacters().pipe(
					map((res) => res),
					switchMap((chars) =>
						this.userService.getUserData().pipe(map((user) => (user.isAdmin ? chars : chars.filter((c) => c.isPublic)))),
					),
			  ),
	]).pipe(
		map(([user, characters]) => characters),
		shareReplay(1), // garde en mémoire pour éviter de recharger inutilement
	);

	currentUser$ = this.userService.getUserData().pipe(filter(Boolean), shareReplay(1));

	isMyCharacterPage: boolean = this.router.url === '/mycharacters';

	constructor(
		private characterService: CharacterService,
		private modalService: NgbModal,
		private router: Router,
		private userService: UserService,
	) {}

	createNewCharacter() {
		this.router.navigate(['/create-character']);
	}

	openDeleteModal(character: Character) {
		const modalRef = this.modalService.open(DeleteCharacterModalComponent);
		modalRef.componentInstance.character = character;
		modalRef.componentInstance.confirmDelete.subscribe(() => {
			this.deleteCharacter(character._id);
		});
	}

	deleteCharacter(characterId: string) {
		this.characterService
			.deleteCharacter(characterId)
			.pipe(
				tap(() => {
					// Recharge les persos après suppression
					if (this.router.url === '/mycharacters') {
						this.currentUser$.pipe(switchMap((user) => this.characterService.getCharactersByUser(user._id))).subscribe();
					} else {
						this.characterService.getCharacters().subscribe();
					}
				}),
			)
			.subscribe();
	}
}
