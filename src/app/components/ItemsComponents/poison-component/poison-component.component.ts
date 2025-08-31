import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePoisonComponent } from 'app/components/modal/create-poison/create-poison.component';
import { Poison } from 'app/models/items/poison';
import { PoisonService } from 'app/services/LupinoApi/items/poison.service';
import { catchError, Observable, of, shareReplay } from 'rxjs';

@Component({
	selector: 'app-poison-component',
	templateUrl: './poison-component.component.html',
	styleUrls: ['./poison-component.component.css', '../../../../assets/styles/items.css'],
	standalone: false,
})
export class PoisonComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;

	// Observable pour les poisons
	poisons$!: Observable<Poison[]>; // Remplacez 'any' par le type approprié pour vos poisons
	searchText = '';

	constructor(
		private poisonService: PoisonService,
		private modalService: NgbModal,
	) {
		// Initialisation des observables avec les données appropriées
		this.loadPoisons();
	}

	filterFn = (poison: Poison) => {
		return (
			poison.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
			poison.effet.toLowerCase().includes(this.searchText.toLowerCase()) ||
			poison.prix?.toString().includes(this.searchText.toLowerCase())
		);
	};

	onSearchChange(value: string | null) {
		if (value === null) {
			value = '';
		}
		this.searchText = value;
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

	private loadPoisons(): void {
		this.poisons$ = this.poisonService.getPoisons().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}
}
