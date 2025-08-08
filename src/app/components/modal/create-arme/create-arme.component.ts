import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Arme } from '../../../models/items/arme';
import { ArmeService } from '../../../services/LupinoApi/items/arme.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // Si tu utilises ng-bootstrap

@Component({
    selector: 'app-create-arme',
    templateUrl: './create-arme.component.html',
    styleUrls: ['./create-arme.component.css'],
    standalone: false
})
export class CreateArmeComponent {
  armeForm: FormGroup;

  rareteOptions: string[] = ['normal', 'supérieur'];
  categorieOptions: string[] = ['cac', 'distance', 'siege', 'explosif'];
  typeOptions: string[] = ['-','une main', 'deux mains',  'tout'];
  maniementOptions: string[] = ['-','agilité', 'force', 'both'];

  constructor(
    private fb: FormBuilder,
    private armeService: ArmeService,
    public activeModal: NgbActiveModal // Pour fermer la modale
  ) {
    this.armeForm = this.fb.group({
      rarete: ['', Validators.required],
      nom: ['', Validators.required],
      type: ['', Validators.required],
      categorie: ['', Validators.required],
      maniement: ['', Validators.required],
      effet: [''],
      degats: ['', Validators.required],
      portee: [''],
      munitions: [''],
      prix: [0, Validators.required],
      prixMunitions: [0]
    });
  }

  // Méthode pour créer une nouvelle arme
  createArme() {
    if (this.armeForm.valid) {
      const arme: Arme = this.armeForm.value;
      this.armeService.create(arme).subscribe((response) => {
        this.activeModal.close('created'); // Fermer la modale et informer le parent
      });
    }
  }

  // Fermer la modale sans action
  closeModal() {
    this.activeModal.dismiss('cancel');
  }
}