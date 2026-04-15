import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CharacterService } from '../../../../../services/LupinoApi/character.service';
import { environment } from '@environments/environment';

@Component({
	selector: 'app-step-1-basic',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './step-1-basic.html',
	styleUrls: ['./step-1-basic.css'],
})
export class Step1Basic {
	@Input({ required: true }) group!: FormGroup;
	@Input({ required: true }) meta!: FormGroup;

	characterService = inject(CharacterService);

	onFileChange(evt: Event) {
		const input = evt.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			this.characterService.uploadImage(file).subscribe((data: any) => {
				if (data.result == 'OK') {
					console.log(data);
					this.meta.patchValue({
						imageUrl: environment.apiUrl + '/public/persoImg/' + data.file.filename,
					});
				} else {
					alert("Erreur lors de l'upload de l'image");
				}
			});
		}
	}

	// Helpers template (lisible)
	isInvalid(name: string): boolean {
		const c = this.group.get(name);
		return !!(c && c.invalid && (c.touched || c.dirty));
	}
}
