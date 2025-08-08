import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContenantService } from '../../../services/LupinoApi/items/contenant.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contenant } from '../../../models/items/contenant';

@Component({
    selector: 'app-create-contenant',
    templateUrl: './create-contenant.component.html',
    styleUrl: './create-contenant.component.css',
    standalone: false
})
export class CreateContenantComponent {
	contenantForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private contenantService: ContenantService,
		public activeModal: NgbActiveModal
	) {
		this.contenantForm = this.fb.group({
			nom: ['', Validators.required],
			contenance: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	onSubmit() {
		if (this.contenantForm.valid) {
			const newPotion: Contenant = this.contenantForm.value;
			this.contenantService.create(newPotion).subscribe((response:any) => {
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
