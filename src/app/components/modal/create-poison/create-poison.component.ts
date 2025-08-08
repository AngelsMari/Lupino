import { Component } from '@angular/core';
import { PoisonService } from '../../../services/LupinoApi/items/poison.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Poison } from '../../../models/items/poison';

@Component({
    selector: 'app-create-poison',
    templateUrl: './create-poison.component.html',
    styleUrl: './create-poison.component.css',
    standalone: false
})
export class CreatePoisonComponent {
  poisonForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private potionService: PoisonService,
		public activeModal: NgbActiveModal
	) {
		this.poisonForm = this.fb.group({
			nom: ['', Validators.required],
			effet: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	onSubmit() {
		if (this.poisonForm.valid) {
			const newPoison: Poison = this.poisonForm.value;
			this.potionService.create(newPoison).subscribe((response:any) => {
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
