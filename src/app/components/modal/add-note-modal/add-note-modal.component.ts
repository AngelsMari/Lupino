import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-note-modal',
    templateUrl: './add-note-modal.component.html',
    styleUrls: ['./add-note-modal.component.css'],
    standalone: false
})
export class AddNoteModalComponent implements OnInit {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.noteForm = this.fb.group({
      type: ['', Validators.required],
      texte: ['', Validators.required],
      auteur: [sessionStorage.getItem('user_id')]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      // On renvoie la note à la campagne avec les informations saisies.
      this.activeModal.close(this.noteForm.value);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Cross click');
  }
}
