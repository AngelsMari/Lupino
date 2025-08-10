import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateArmeComponent } from 'app/components/modal/create-arme/create-arme.component';
import { Arme } from 'app/models/items/arme';
import { ArmeService } from 'app/services/LupinoApi/items/arme.service';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, shareReplay } from 'rxjs';

@Component({
	selector: 'app-arme-component',
	templateUrl: './arme-component.component.html',
	styleUrl: './arme-component.component.css',
	standalone: false,
})
export class ArmeComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;
	// Observables pour les données
	armes$!: Observable<Arme[]>;
	armesCac$!: Observable<Arme[]>;
	distance$!: Observable<Arme[]>;
	siege$!: Observable<Arme[]>;
	explosif$!: Observable<Arme[]>;

	filterFn = (item: Arme, search: string) =>
		item.nom.toLowerCase().includes(search) ||
		item.type.toLowerCase().includes(search) ||
		item.effet?.toLowerCase().includes(search) ||
		item.degats?.toString().includes(search) ||
		item.prix?.toString().includes(search);

	searchText = '';

	constructor(
		private armeService: ArmeService,
		private router: Router,
		private modalService: NgbModal,
	) {
		this.loadArmes();
		if (this.router.url.startsWith('/create-character')) {
			this.isInCharacterCreation = true;
		}
		// Initialisation des observables avec les données appropriées
		// Exemple : this.armes$ = this.armeService.getArmes();
	}
	private loadArmes(): void {
		this.armes$ = this.armeService.getArmes().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);

		this.armesCac$ = this.armes$.pipe(map((armes: Arme[]) => armes.filter((arme) => arme.categorie === 'cac')));
		this.distance$ = this.armes$.pipe(map((armes: Arme[]) => armes.filter((arme) => arme.categorie === 'distance')));
		this.siege$ = this.armes$.pipe(map((armes: Arme[]) => armes.filter((arme) => arme.categorie === 'siege')));
		this.explosif$ = this.armes$.pipe(map((armes: Arme[]) => armes.filter((arme) => arme.categorie === 'explosif')));
	}

	onSearchChange(value: string | null) {
		if (value === null) {
			value = '';
		}
		this.searchText = value;
	}

	// --- Méthodes modales ---
	openCreateArmeModal(): void {
		const modalRef = this.modalService.open(CreateArmeComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadArmes();
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}
}
