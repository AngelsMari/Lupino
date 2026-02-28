import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-ornement',
	standalone: true,
	templateUrl: './ornement.html',
	styleUrls: ['./ornement.css'],
})
export class OrnementComponent {
	@Input() width: string = '100%';
	@Input() color: string = '#ffb65f';
	@Input() size: number = 10; // diamètre cercle
	@Input() thickness: number = 2; // épaisseur ligne
}
