import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePotionComponent } from 'app/components/modal/create-potion/create-potion.component';
import { Potion } from 'app/models/items/potion';
import { PotionService } from 'app/services/LupinoApi/items/potion.service';
import { catchError, combineLatest, map, Observable, of, shareReplay, tap } from 'rxjs';

@Component({
	selector: 'app-potion-component',
	templateUrl: './potion-component.component.html',
	styleUrl: './potion-component.component.css',
	standalone: false,
})
export class PotionComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;

	filterFn = (potion: Potion) => {
		return (
			potion.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
			potion.effet.toLowerCase().includes(this.searchText.toLowerCase()) ||
			potion.prix?.toString().includes(this.searchText.toLowerCase())
		);
	};

	// Observable pour les potions
	potions$!: Observable<Potion[]>; // Remplacez 'any' par le type approprié pour vos potions

	searchText = '';

	constructor(
		private potionService: PotionService,
		private modalService: NgbModal,
	) {
		this.loadPotions();
	}

	private loadPotions(): void {
		this.potions$ = this.potionService.getPotions().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	onSearchChange(value: string | null) {
		if (value === null) {
			value = '';
		}
		this.searchText = value;
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
}
