import { Component, inject, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUtilitaireComponent } from 'app/components/modal/create-utilitaire/create-utilitaire.component';
import { Utilitaire } from 'app/models/items/utilitaire';
import { UtilitaireService } from 'app/services/LupinoApi/items/utilitaire.service';
import { catchError, combineLatest, map, Observable, of, shareReplay } from 'rxjs';

@Component({
	selector: 'app-utilitaire-component',
	templateUrl: './utilitaire-component.component.html',
	styleUrl: './utilitaire-component.component.css',
	standalone: false,
})
export class UtilitaireComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;

	utilitaireService = inject(UtilitaireService);
	modalService = inject(NgbModal);

	filterFn = (item: Utilitaire, search: string) =>
		item.nom.toLowerCase().includes(search) || item.effet.toLowerCase().includes(search) || item.prix?.toString().includes(search);

	utilitaire$!: Observable<Utilitaire[]>;
	searchText = '';

	constructor() {
		this.loadUtilitaires();
	}

	onSearchChange(value: string | null) {
		if (value === null) {
			value = '';
		}
		this.searchText = value;
	}

	loadUtilitaires(): void {
		this.utilitaire$ = this.utilitaireService.getUtilitaires().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
	}

	openCreateUtilitaireModal(): void {
		const modalRef = this.modalService.open(CreateUtilitaireComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadUtilitaires(); // Recharger les utilitaires après création
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}
}
