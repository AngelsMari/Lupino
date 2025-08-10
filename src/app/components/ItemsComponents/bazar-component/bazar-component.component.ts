import { Component, inject, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBazarComponent } from 'app/components/modal/create-bazar/create-bazar.component';
import { Bazar } from 'app/models/items/bazar';
import { BazarService } from 'app/services/LupinoApi/items/bazar.service';
import { catchError, combineLatest, map, Observable, of, shareReplay } from 'rxjs';

@Component({
	selector: 'app-bazar-component',
	templateUrl: './bazar-component.component.html',
	styleUrl: './bazar-component.component.css',
	standalone: false,
})
export class BazarComponentComponent {
	bazarService = inject(BazarService);
	modalService = inject(NgbModal);

	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;

	filterFn = (item: Bazar, search: string) => item.nom.toLowerCase().includes(search) || item.prix?.toString().includes(search);

	bazar$!: Observable<Bazar[]>;
	searchText = '';

	constructor() {
		this.loadBazars();
	}

	private loadBazars(): void {
		this.bazar$ = this.bazarService.getBazars().pipe(
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

	openCreateBazarModal(): void {
		const modalRef = this.modalService.open(CreateBazarComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') this.loadBazars(); // Recharger les bazars après création
			},
			(reason) => {
				console.log('Modale fermée:', reason);
			},
		);
	}
}
