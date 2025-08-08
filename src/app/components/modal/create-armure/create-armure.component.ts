import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Armure } from '../../../models/items/armure';
import { ArmureService } from '../../../services/LupinoApi/items/armure.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create-armure',
    templateUrl: './create-armure.component.html',
    styleUrls: ['./create-armure.component.css'],
    standalone: false
})
export class CreateArmureComponent {
	armureForm: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private armureService: ArmureService,
		public activeModal: NgbActiveModal
	) {
		this.armureForm = this.fb.group({
			nom: ['', Validators.required],
			categorie: ['', Validators.required],
			description: ['', Validators.required],
			statistiques: ['', Validators.required],
			prix: ['', [Validators.required, Validators.min(0)]]
		});
	}
	
	createArmure() {
		if (this.armureForm.valid) {
			const newArmure: Armure = this.armureForm.value;
			this.armureService.create(newArmure).subscribe((response:any)=> {
				if (response["result"] == "ERROR") {
					// Gérer l'erreur ici
					this.activeModal.close('error');
				}else{
					this.activeModal.close('created');
				}
			});
		}
	}
	// Fermer la modale sans action
	closeModal() {
		this.activeModal.dismiss('cancel');
	}
}