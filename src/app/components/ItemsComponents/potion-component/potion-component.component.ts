import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePotionComponent } from 'app/components/modal/create-potion/create-potion.component';
import { Potion } from 'app/models/items/potion';
import { PotionService } from 'app/services/LupinoApi/items/potion.service';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { FilterListPipe } from '../../../pipes/filter-list.pipe';

@Component({
    selector: 'app-potion-component',
    templateUrl: './potion-component.component.html',
    styleUrls: ['./potion-component.component.css', '../../../../assets/styles/items.css'],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        FilterListPipe,
    ],
})
export class PotionComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;
	// Observable pour les potions
	potions$!: Observable<Potion[]>; // Remplacez 'any' par le type approprié pour vos potions
	searchText = '';

	constructor(
		private potionService: PotionService,
		private modalService: NgbModal,
	) {
		this.loadPotions();
	}

	filterFn = (potion: Potion) => {
		return (
			potion.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
			potion.effet.toLowerCase().includes(this.searchText.toLowerCase()) ||
			potion.prix?.toString().includes(this.searchText.toLowerCase())
		);
	};

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

	private loadPotions(): void {
		this.potions$ = this.potionService.getPotions().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}
}
