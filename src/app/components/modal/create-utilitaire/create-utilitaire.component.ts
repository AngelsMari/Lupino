import { Component } from '@angular/core';
import { Utilitaire } from '../../../models/items/utilitaire';
import { UtilitaireService } from '../../../services/LupinoApi/items/utilitaire.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create-utilitaire',
    templateUrl: './create-utilitaire.component.html',
    styleUrl: './create-utilitaire.component.css',
    standalone: false
})
export class CreateUtilitaireComponent {
  utilitaireForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private utilitaireService: UtilitaireService,
		public activeModal: NgbActiveModal
	) {
		this.utilitaireForm = this.fb.group({
			nom: ['', Validators.required],
			effet: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	onSubmit() {
		if (this.utilitaireForm.valid) {
			const newUtilitaire: Utilitaire = this.utilitaireForm.value;
			this.utilitaireService.create(newUtilitaire).subscribe((response:any) => {
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
