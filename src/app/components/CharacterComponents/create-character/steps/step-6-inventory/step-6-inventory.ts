import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { ItemsComponent } from '../../../../ItemComponents/items/items.component';

@Component({
	selector: 'app-step-6-inventory',
	standalone: true,
	imports: [ReactiveFormsModule, QuillEditorComponent, ItemsComponent],
	templateUrl: './step-6-inventory.html',
	styleUrls: ['./step-6-inventory.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step6Inventory {
	@Input({ required: true }) form!: FormGroup;
}
