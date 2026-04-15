import { Component, inject, OnInit } from '@angular/core';
import { Character } from '../../../models/character';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
	CharacterCalculatorService,
	PrimaryStats,
} from '../../../services/character-calculator.service';
import { CharacterHeaderComponent } from './components/character-header/character-header';
import { CharacterOverviewComponent } from './components/character-overview/character-overview';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { Race, RaceBonus } from '../../../models/race';
import { CharacterSessionResourcesComponent } from './components/character-session-resources/character-session-resources';
import { CharacterStats } from './components/tabs/character-stats/character-stats';
import { CharacterSkills } from './components/tabs/character-skills/character-skills';

@Component({
	selector: 'app-character-detail',
	templateUrl: './character-detail.component.html',
	styleUrls: ['./character-detail.component.css'],
	imports: [
		RouterLink,
		AsyncPipe,
		CharacterHeaderComponent,
		CharacterOverviewComponent,
		CharacterSessionResourcesComponent,
		CharacterStats,
		CharacterSkills,
	],
})
export class CharacterDetailComponent implements OnInit {
	private fb = inject(FormBuilder);
	private activatedRoute = inject(ActivatedRoute);
	private characterService = inject(CharacterService);
	private userService = inject(UserService);
	private toastr = inject(ToastrService);
	private sanitizer = inject(DomSanitizer);
	private calc = inject(CharacterCalculatorService);
	private router = inject(Router);

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

	private characterSubject = new BehaviorSubject<Character | null>(null);
	character$ = this.characterSubject.asObservable();

	private raceService = inject(RaceService);

	races$ = this.raceService.getRaces();

	lineageDisplay$ = combineLatest([this.character$, this.races$]).pipe(
		map(([character, races]) => {
			if (!character) return null;

			if (!character.lineage) {
				return {
					raceNames: character.race ? [character.race] : [],
					bonuses: [],
				};
			}

			const lineage: any = character.lineage;

			if (lineage.kind === 'pure') {
				const race = races.find((r) => r._id === lineage.raceId);

				const bonuses = (race?.bonuses ?? []).filter((bonus) =>
					(lineage.chosenBonusIds ?? []).includes(bonus._id),
				);

				return {
					raceNames: race ? [race.name] : [],
					bonuses,
				};
			}

			const parentRaces = (lineage.parentRaceIds ?? [])
				.map((id: string) => races.find((r) => r._id === id))
				.filter(Boolean);

			const raceNames = parentRaces.map((r: Race) => r!.name);

			const allBonuses = parentRaces.flatMap((r: Race) => r!.bonuses ?? []);

			const bonuses = allBonuses.filter((bonus: RaceBonus) =>
				(lineage.chosenBonusIds ?? []).includes(bonus._id),
			);

			return {
				raceNames,
				bonuses,
			};
		}),
	);

	ngOnInit() {
		// Chargement du personnage et mise à jour du BehaviorSubject + formulaire
		this.param$
			.pipe(switchMap((params) => this.characterService.getCharacterById(params['id'])))
			.subscribe((character) => {
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

	primaryStats$ = this.character$.pipe(
		map((character) => {
			if (!character) return null;

			const baseStats: PrimaryStats = this.calc.clampPrimaryStats({
				strength: Number(character.strength ?? 30),
				agility: Number(character.agility ?? 30),
				endurance: Number(character.endurance ?? 30),
				social: Number(character.social ?? 30),
				mental: Number(character.mental ?? 30),
			});

			const primaryModifiers = character.statModifiers?.primary ?? {};

			return {
				strength: baseStats.strength + Number(primaryModifiers.strength ?? 0),
				agility: baseStats.agility + Number(primaryModifiers.agility ?? 0),
				endurance: baseStats.endurance + Number(primaryModifiers.endurance ?? 0),
				social: baseStats.social + Number(primaryModifiers.social ?? 0),
				mental: baseStats.mental + Number(primaryModifiers.mental ?? 0),
			};
		}),
	);

	// Calcul secondaryStats
	secondaryStats$ = this.character$.pipe(
		map((character) => {
			if (!character) return null;

			const baseStats: PrimaryStats = this.calc.clampPrimaryStats({
				strength: Number(character.strength ?? 30),
				agility: Number(character.agility ?? 30),
				endurance: Number(character.endurance ?? 30),
				social: Number(character.social ?? 30),
				mental: Number(character.mental ?? 30),
			});

			return this.calc.computeSecondaryStats(baseStats, character.statModifiers);
		}),
	);

	sessionActive: boolean = false;

	bonuses$ = this.primaryStats$.pipe(
		map((stats) => {
			if (!stats) return {};
			return {
				strength: this.getBonus(stats.strength),
				agility: this.getBonus(stats.agility),
				endurance: this.getBonus(stats.endurance),
				social: this.getBonus(stats.social),
				mental: this.getBonus(stats.mental),
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
		console.log(this.characterForm.value);
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
		console.log('updated', character.isPublic);
		const updatedCharacter = { ...character, isPublic: !character.isPublic };
		console.log('updated', updatedCharacter);
		return this.characterService.updateCharacter(updatedCharacter).pipe(
			tap((updated) => {
				this.characterSubject.next(updated);
				this.initForm(updated);
				this.toastr.success(
					`Personnage maintenant ${updated.isPublic ? 'public' : 'privé'}`,
				);
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

	goToEdit(characterId: string) {
		this.router.navigate(['/create-character', characterId]);
	}
}
