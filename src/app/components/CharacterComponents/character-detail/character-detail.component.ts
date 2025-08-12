import { Component, inject, OnInit } from '@angular/core';
import { Character } from '../../../models/character';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, map, tap, switchMap, catchError, of, max } from 'rxjs';

@Component({
	selector: 'app-character-detail',
	templateUrl: './character-detail.component.html',
	styleUrls: ['./character-detail.component.css'],
	standalone: false,
})
export class CharacterDetailComponent implements OnInit {
	private fb = inject(FormBuilder);
	private activatedRoute = inject(ActivatedRoute);
	private characterService = inject(CharacterService);
	private userService = inject(UserService);
	private toastr = inject(ToastrService);
	private sanitizer = inject(DomSanitizer);

	// FormGroup
	characterForm: FormGroup = this.fb.group({
		_id: [''],
		current_hp: [{ value: '', disabled: true }],
		current_mana: [{ value: '', disabled: true }],
		inventory: [''],
		max_hp: [{ value: '', disabled: true }],
		max_mana: [{ value: '', disabled: true }],
	});

	param$ = this.activatedRoute.params;
	currentUser$ = this.userService.getUserData().pipe(map((user) => user ?? null));

	// BehaviorSubject pour le personnage
	private characterSubject = new BehaviorSubject<Character | null>(null);
	character$ = this.characterSubject.asObservable();

	ngOnInit() {
		// Chargement du personnage et mise à jour du BehaviorSubject + formulaire
		this.param$.pipe(switchMap((params) => this.characterService.getCharacterById(params['id']))).subscribe((character) => {
			this.characterSubject.next(character);
			this.initForm(character);
		});
	}

	// Combinaison personnage + user + validation d'accès
	characterWithAccess$ = combineLatest([this.character$, this.currentUser$]).pipe(
		map(([character, user]) => {
			const characterOwnerId = character?.owner?._id;
			const isPublic = character?.isPublic;
			const userId = user?._id;
			const isAdmin = user?.isAdmin;

			if (userId !== characterOwnerId && !isPublic && !isAdmin) {
				this.toastr.error("Vous n'avez pas accès à ce personnage");
				throw new Error('Accès refusé');
			}
			return { character, user };
		}),
		catchError(() => of(null)),
	);

	// Calcul secondaryStats
	secondaryStats$ = this.character$.pipe(
		map((character) => {
			if (!character) return null;
			const { strength, endurance, mental, agility, social } = character;
			return {
				constitution: Math.floor((strength + endurance) / 10),
				resilience: Math.floor((endurance + mental) / 10),
				reflex: Math.floor((mental + agility) / 10),
				charisma: Math.floor((social + Math.max(agility, strength)) / 10),
			};
		}),
	);

	sessionActive: boolean = false;

	bonuses$ = this.character$.pipe(
		map((character) => {
			if (!character) return {};
			return {
				strength: this.getBonus(character.strength),
				agility: this.getBonus(character.agility),
				endurance: this.getBonus(character.endurance),
				social: this.getBonus(character.social),
				mental: this.getBonus(character.mental),
			};
		}),
	);

	getBonus(value: number): string {
		if (value < 30) return '-2';
		if (value < 50) return '-1';
		if (value < 60) return '0';
		if (value < 70) return '+1';
		return '+2';
	}

	private initForm(character: Character) {
		this.characterForm.patchValue({
			_id: character._id,
			current_hp: character.current_hp,
			current_mana: character.current_mana,
			inventory: character.inventory,
			max_hp: character.max_hp,
			max_mana: character.max_mana,
		});
		this.characterForm.disable();
	}

	startSession() {
		this.characterForm.enable();
		this.sessionActive = true;
	}

	endSession() {
		this.characterForm.disable();
		this.sessionActive = false;
	}

	modifyHp(amount: number | 'max') {
		const maxHp = this.characterForm.get('max_hp')?.value;
		if (amount === 'max') {
			this.characterForm.patchValue({ current_hp: maxHp });
		} else {
			const currentHp = this.characterForm.get('current_hp')?.value ?? 0;
			console.log('Current HP:', currentHp, 'Amount:', amount, 'Max HP:', maxHp);
			this.characterForm.patchValue({
				current_hp: Math.min(maxHp, currentHp + amount),
			});
		}

		this.characterService
			.updateCharacter(this.characterForm.value)
			.pipe(
				tap((updated) => {
					this.characterSubject.next(updated);
					this.initForm(updated);
				}),
				catchError((err) => {
					this.toastr.error('Erreur lors de la mise à jour');
					return of(null);
				}),
			)
			.subscribe();
	}

	modifyMana(amount: number | 'max') {
		const maxMana = this.characterForm.get('max_mana')?.value;
		if (amount === 'max') {
			this.characterForm.patchValue({ current_mana: maxMana });
		} else {
			const currentMana = this.characterForm.get('current_mana')?.value ?? 0;
			this.characterForm.patchValue({
				current_mana: Math.max(0, Math.min(maxMana, currentMana + amount)),
			});
		}
		this.characterService
			.updateCharacter(this.characterForm.value)
			.pipe(
				tap((updated) => {
					this.characterSubject.next(updated);
					this.initForm(updated);
				}),
				catchError((err) => {
					this.toastr.error('Erreur lors de la mise à jour');
					return of(null);
				}),
			)
			.subscribe();
	}

	formatText(text: string): SafeHtml {
		if (!text) return '';
		text = text.replace(/&nbsp;/g, ' ');
		text = text.replace(/<p><\/p>/g, '<br>');
		text = text.replace(/\n/g, '<br>');
		return this.sanitizer.bypassSecurityTrustHtml(text);
	}

	// Toggle visibility avec mise à jour du BehaviorSubject et formulaire
	toggleVisibility() {
		const character = this.characterSubject.getValue();
		if (!character) return of(null);

		const updatedCharacter = { ...character, isPublic: !character.isPublic };
		return this.characterService.updateCharacter(updatedCharacter).pipe(
			tap((updated) => {
				this.characterSubject.next(updated);
				this.initForm(updated);
				this.toastr.success(`Personnage maintenant ${updated.isPublic ? 'public' : 'privé'}`);
			}),
			catchError((err) => {
				this.toastr.error('Erreur lors de la mise à jour');
				return of(null);
			}),
		);
	}

	onToggleVisibility() {
		this.toggleVisibility().subscribe();
	}
}
