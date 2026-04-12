import { Component } from '@angular/core';
import { UserService } from '../../../services/LupinoApi/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContenantService } from '../../../services/LupinoApi/items/contenant.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ArmeComponentComponent } from '../../ItemsComponents/arme-component/arme-component.component';
import { ArmureComponent } from '../../ItemsComponents/armure-component/armure-component.component';
import { PotionComponentComponent } from '../../ItemsComponents/potion-component/potion-component.component';
import { PoisonComponentComponent } from '../../ItemsComponents/poison-component/poison-component.component';
import { UtilitaireComponentComponent } from '../../ItemsComponents/utilitaire-component/utilitaire-component.component';
import { BazarComponentComponent } from '../../ItemsComponents/bazar-component/bazar-component.component';
import { ContenantComponentComponent } from '../../ItemsComponents/contenant-component/contenant-component.component';

@Component({
	selector: 'app-items',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.css'],
	imports: [
		ArmeComponentComponent,
		ArmureComponent,
		PotionComponentComponent,
		PoisonComponentComponent,
		UtilitaireComponentComponent,
		BazarComponentComponent,
		ContenantComponentComponent,
	],
})
export class ItemsComponent {
	isAdmin$!: Observable<boolean>;
	isInCharacterCreation = false;

	activeTab = 'armes';

	constructor(
		private modalService: NgbModal,
		private contenantService: ContenantService,
		private router: Router,
		private userService: UserService,
	) {}

	ngOnInit(): void {
		this.checkIfAdmin();

		if (this.router.url.startsWith('/create-character')) {
			this.isInCharacterCreation = true;
		}
	}

	private checkIfAdmin(): void {
		this.isAdmin$ = this.userService.getUserData().pipe(
			map((user) => user?.isAdmin ?? false),
			startWith(false),
			shareReplay(1),
		);
	}

	setActiveTab(tab: string) {
		this.activeTab = tab;
	}
}
