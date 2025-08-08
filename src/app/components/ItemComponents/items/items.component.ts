import { Component } from '@angular/core';
import { Arme } from '../../../models/items/arme';
import { UserService } from '../../../services/LupinoApi/user.service';
import { ArmeService } from '../../../services/LupinoApi/items/arme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateArmeComponent } from '../../modal/create-arme/create-arme.component';
import { Armure } from '../../../models/items/armure';
import { ArmureService } from '../../../services/LupinoApi/items/armure.service';
import { CreateArmureComponent } from '../../modal/create-armure/create-armure.component';
import { PotionService } from '../../../services/LupinoApi/items/potion.service';
import { Potion } from '../../../models/items/potion';
import { CreatePotionComponent } from '../../modal/create-potion/create-potion.component';
import { CreatePoisonComponent } from '../../modal/create-poison/create-poison.component';
import { Poison } from '../../../models/items/poison';
import { PoisonService } from '../../../services/LupinoApi/items/poison.service';
import { Utilitaire } from '../../../models/items/utilitaire';
import { UtilitaireService } from '../../../services/LupinoApi/items/utilitaire.service';
import { CreateUtilitaireComponent } from '../../modal/create-utilitaire/create-utilitaire.component';
import { Contenant } from '../../../models/items/contenant';
import { ContenantService } from '../../../services/LupinoApi/items/contenant.service';
import { CreateContenantComponent } from '../../modal/create-contenant/create-contenant.component';
import { CreateBazarComponent } from '../../modal/create-bazar/create-bazar.component';
import { BazarService } from '../../../services/LupinoApi/items/bazar.service';
import { Bazar } from '../../../models/items/bazar';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css'],
    standalone: false
})
export class ItemsComponent {
	armurelegere$!: Observable<Armure[]>;
	armureinter$!: Observable<Armure[]>;
	armurelourde$!: Observable<Armure[]>;

	potions$!: Observable<Potion[]>;
	poisons$!: Observable<Poison[]>;
	utilitaires$!: Observable<Utilitaire[]>;
	contenants$!: Observable<Contenant[]>;
	bazars$!: Observable<Bazar[]>;

	isAdmin$!: Observable<boolean>;
	isInCharacterCreation = false;

	// searchText sous forme de BehaviorSubject pour rendre la recherche réactive
	private searchTextSubject = new BehaviorSubject<string>('');
	searchText$ = this.searchTextSubject.asObservable();

	constructor(
		private modalService: NgbModal,
		private armureService: ArmureService,
		private potionService: PotionService,
		private poisonService: PoisonService,
		private utilitaireService: UtilitaireService,
		private contenantService: ContenantService,
		private bazarService: BazarService,
		private router: Router,
		private userService: UserService,
	) {}

	ngOnInit(): void {
		this.loadArmures();
		this.loadPotions();
		this.loadPoisons();
		this.loadUtilitaires();
		this.loadContenants();
		this.loadBazars();
		this.checkIfAdmin();

		if (this.router.url.startsWith('/create-character')) {
			this.isInCharacterCreation = true;
		}
	}

	private loadArmures(): void {
		const armures$ = this.armureService.getArmures().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);

		this.armurelegere$ = armures$.pipe(map((armures) => armures.filter((a) => a.categorie === 'légère')));
		this.armureinter$ = armures$.pipe(map((armures) => armures.filter((a) => a.categorie === 'intermédiaire')));
		this.armurelourde$ = armures$.pipe(map((armures) => armures.filter((a) => a.categorie === 'lourde')));
	}

	private loadPotions(): void {
		this.potions$ = this.potionService.getPotions().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	private loadPoisons(): void {
		this.poisons$ = this.poisonService.getPoisons().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	private loadUtilitaires(): void {
		this.utilitaires$ = this.utilitaireService.getUtilitaires().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	private loadContenants(): void {
		this.contenants$ = this.contenantService.getContenant().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	private loadBazars(): void {
		this.bazars$ = this.bazarService.getBazars().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	private checkIfAdmin(): void {
		this.isAdmin$ = this.userService.getUserData().pipe(
			map((user) => user?.isAdmin ?? false),
			startWith(false),
			shareReplay(1),
		);
	}

	// --- Recherche réactive ---
	// Méthodes pour mettre à jour le search text depuis le template
	onSearchTextChanged(text: string) {
		this.searchTextSubject.next(text);
	}

	// Fonction générique de filtre pour armures
	filterArmures(armures$: Observable<Armure[]>): Observable<Armure[]> {
		return combineLatest([armures$, this.searchText$]).pipe(
			map(([armures, searchText]) => {
				const s = searchText.toLowerCase();
				return armures.filter(
					(armure) =>
						armure.nom.toLowerCase().includes(s) ||
						armure.description.toLowerCase().includes(s) ||
						armure.statistiques?.toLowerCase().includes(s) ||
						armure.prix?.toString().includes(s),
				);
			}),
		);
	}

	// Fonction générique de filtre pour potions, poisons, utilitaires, contenants, bazars
	filterItems<T extends { nom: string; effet?: string; prix?: any }>(items$: Observable<T[]>): Observable<T[]> {
		return combineLatest([items$, this.searchText$]).pipe(
			map(([items, searchText]) => {
				const s = searchText.toLowerCase();
				return items.filter(
					(item) => item.nom.toLowerCase().includes(s) || item.effet?.toLowerCase().includes(s) || item.prix?.toString().includes(s),
				);
			}),
		);
	}

	// --- Getters exposés pour le template avec filtres appliqués ---
	get filteredArmuresLeg$() {
		return this.filterArmures(this.armurelegere$);
	}

	get filteredArmuresInter$() {
		return this.filterArmures(this.armureinter$);
	}

	get filteredArmuresLourdes$() {
		return this.filterArmures(this.armurelourde$);
	}

	get filteredPotions$() {
		return this.filterItems(this.potions$);
	}

	get filteredPoisons$() {
		return this.filterItems(this.poisons$);
	}

	get filteredUtilitaires$() {
		return this.filterItems(this.utilitaires$);
	}

	get filteredContenants$() {
		return this.filterItems(this.contenants$);
	}

	get filteredBazars$() {
		return this.filterItems(this.bazars$);
	}

	openCreateArmureModal(): void {
		const modalRef = this.modalService.open(CreateArmureComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadArmures();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}

	openCreatePotionModal(): void {
		const modalRef = this.modalService.open(CreatePotionComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadPotions();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}

	openCreatePoisonModal(): void {
		const modalRef = this.modalService.open(CreatePoisonComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadPoisons();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}

	openCreateUtilitaireModal(): void {
		const modalRef = this.modalService.open(CreateUtilitaireComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadUtilitaires();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}

	openCreateContenantModal(): void {
		const modalRef = this.modalService.open(CreateContenantComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadContenants();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}

	openCreateBazarModal(): void {
		const modalRef = this.modalService.open(CreateBazarComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadBazars();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}
}
