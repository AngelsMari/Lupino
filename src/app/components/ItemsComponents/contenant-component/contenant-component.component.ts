import { Component, inject, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateContenantComponent } from 'app/components/modal/create-contenant/create-contenant.component';
import { Contenant } from 'app/models/items/contenant';
import { ContenantService } from 'app/services/LupinoApi/items/contenant.service';
import { catchError, Observable, of, shareReplay } from 'rxjs';

@Component({
	selector: 'app-contenant-component',
	templateUrl: './contenant-component.component.html',
	styleUrl: './contenant-component.component.css',
	standalone: false,
})
export class ContenantComponentComponent {
	@Input() isAdmin$!: Observable<boolean>;
	@Input() isInCharacterCreation!: boolean;

	contenant$!: Observable<Contenant[]>;

	modalService: NgbModal = inject(NgbModal);
	contenantService: ContenantService = inject(ContenantService);

	filterFn = (item: Contenant, search: string) =>
		item.nom.toLowerCase().includes(search) || item.contenance.toLowerCase().includes(search) || item.prix?.toString().includes(search);

	searchText: string = '';

	constructor() {
		this.loadContenants();
	}

	loadContenants(): void {
		this.contenant$ = this.contenantService.getContenant().pipe(
			catchError(() => of([])),
			shareReplay(1),
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
}
