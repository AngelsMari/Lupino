import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RaceService } from '../../../services/LupinoApi/race.service';

@Component({
    selector: 'app-race-create',
    templateUrl: './race-create.component.html',
    styleUrl: './race-create.component.css',
    standalone: false
})
export class RaceCreateComponent {
  raceForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal, 
    private fb: FormBuilder, 
    private raceService: RaceService
  ) {
    this.raceForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      trait: ['', Validators.required]
    });
  }

  // Méthode pour soumettre le formulaire et créer une nouvelle race
  submit(): void {
    if (this.raceForm.valid) {
      const newRace = this.raceForm.value;
      this.raceService.createRace(newRace).subscribe(response => {
        // Ferme la modale après la création
        this.activeModal.close('Race Created');
      });
    }
  }

  // Méthode pour annuler la création et fermer la modale
  cancel(): void {
    this.activeModal.dismiss('Cancel');
  }

}
