import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-delete-character-modal',
    templateUrl: './delete-character-modal.component.html',
    styleUrls: ['./delete-character-modal.component.css'],
    standalone: false
})
export class DeleteCharacterModalComponent {
  @Input() character: any; // Reçoit les données du personnage à supprimer
  @Output() confirmDelete = new EventEmitter<void>(); // Émet un événement lorsqu'on confirme la suppression

  constructor(public activeModal: NgbActiveModal) {}

  onDelete() {
    this.confirmDelete.emit(); // Émet l'événement pour confirmer la suppression
    console.log("ici");
    this.activeModal.close(); // Ferme la modale
  }

  onCancel() {
    this.activeModal.dismiss(); // Ferme la modale sans action
  }
}
