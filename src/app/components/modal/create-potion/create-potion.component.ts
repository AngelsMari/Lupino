import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Potion } from '../../../models/items/potion';
import { PotionService } from '../../../services/LupinoApi/items/potion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create-potion',
    templateUrl: './create-potion.component.html',
    styleUrls: ['./create-potion.component.css'],
    standalone: false
})
export class CreatePotionComponent {
	potionForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private potionService: PotionService,
		public activeModal: NgbActiveModal
	) {
		this.potionForm = this.fb.group({
			nom: ['', Validators.required],
			type: ['', Validators.required],
			effet: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	onSubmit() {
		if (this.potionForm.valid) {
			const newPotion: Potion = this.potionForm.value;
			this.potionService.create(newPotion).subscribe((response:any) => {
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
