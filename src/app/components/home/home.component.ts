import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrnementComponent } from '../../shared/ornement/ornement';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
	imports: [RouterLink, OrnementComponent],
})
export class HomeComponent {}
