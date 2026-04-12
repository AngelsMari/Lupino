import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
	selector: 'app-step-7-backstory',
	standalone: true,
	imports: [ReactiveFormsModule, QuillEditorComponent],
	templateUrl: './step-7-backstory.html',
	styleUrls: ['./step-7-backstory.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step7Backstory {
	@Input({ required: true }) form!: FormGroup;
}
