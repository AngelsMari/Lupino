import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateArmureComponent } from 'app/components/modal/create-armure/create-armure.component';
import { Armure } from 'app/models/items/armure';
import { ArmureService } from 'app/services/LupinoApi/items/armure.service';
import { catchError, combineLatest, map, Observable, of, shareReplay, tap } from 'rxjs';

@Component({
	selector: 'app-armure-component',
	templateUrl: './armure-component.component.html',
	styleUrl: './armure-component.component.css',
	standalone: false,
})
export class ArmureComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;
	// Observables pour les données
	armures$!: Observable<Armure[]>;
	armuresLegeres$!: Observable<Armure[]>;
	armuresInter$!: Observable<Armure[]>;
	armuresLourdes$!: Observable<Armure[]>;

	filterFn = (armure: Armure) => {
		return (
			armure.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
			armure.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
			armure.statistiques?.toLowerCase().includes(this.searchText.toLowerCase()) ||
			armure.prix?.toString().includes(this.searchText.toLowerCase())
		);
	};

	searchText = '';

	constructor(
		private armureService: ArmureService,
		private modalService: NgbModal,
	) {
		this.loadArmures();
	}
	private loadArmures(): void {
		this.armures$ = this.armureService.getArmures().pipe(
			catchError(() => of([])),
			shareReplay(1),
			tap((data) => console.log('data', data)),
		);

		this.armuresLegeres$ = this.armures$.pipe(
			map((armures: Armure[]) => armures.filter((armure) => armure.categorie === 'légère')),
			tap((data) => console.log('armures légères', data)),
		);
		this.armuresInter$ = this.armures$.pipe(map((armures: Armure[]) => armures.filter((armure) => armure.categorie === 'intermédiaire')));
		this.armuresLourdes$ = this.armures$.pipe(map((armures: Armure[]) => armures.filter((armure) => armure.categorie === 'lourde')));
	}

	onSearchChange(value: string | null) {
		if (value === null) {
			value = '';
		}
		this.searchText = value;
	}

	// Fonction générique de filtre pour armures
	filterArmures(armures$: Observable<Armure[]>): Observable<Armure[]> {
		return combineLatest([armures$, of(this.searchText)]).pipe(
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
	// --- Getters exposés pour le template avec filtres appliqués ---
	get filteredArmuresLeg$() {
		return this.filterArmures(this.armuresLegeres$);
	}

	get filteredArmuresInter$() {
		return this.filterArmures(this.armuresInter$);
	}

	get filteredArmuresLourdes$() {
		return this.filterArmures(this.armuresLourdes$);
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
}
