import { Component } from '@angular/core';
import { BazarService } from '../../../services/LupinoApi/items/bazar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Bazar } from '../../../models/items/bazar';

@Component({
    selector: 'app-create-bazar',
    templateUrl: './create-bazar.component.html',
    styleUrl: './create-bazar.component.css',
    standalone: false
})
export class CreateBazarComponent {
  bazarForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
    	private bazarService: BazarService,
		public activeModal: NgbActiveModal
	) {
		this.bazarForm = this.fb.group({
			nom: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	onSubmit() {
		if (this.bazarForm.valid) {
			const bazar: Bazar = this.bazarForm.value;
			this.bazarService.create(bazar).subscribe((response:any) => {
				if (response['result'] === 'ERROR') {
					// Gérer l'erreur ici
					console.error('Erreur lors de la création de la potion', response);
					return;
				}else{
					this.activeModal.close('created');
					
				}
				// Fermer la modale ou effectuer d'autres actions après la création
			});
		}
	}
	closeModal() {
		this.activeModal.dismiss('cancel');
	}
}
