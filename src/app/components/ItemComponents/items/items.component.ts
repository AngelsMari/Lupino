import { Component } from '@angular/core';
import { Arme } from '../../../models/items/arme';
import { UserService } from '../../../services/LupinoApi/user.service';
import { ArmeService } from '../../../services/LupinoApi/items/arme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateArmeComponent } from '../../modal/create-arme/create-arme.component';
import { Armure } from '../../../models/items/armure';
import { ArmureService } from '../../../services/LupinoApi/items/armure.service';
import { CreateArmureComponent } from '../../modal/create-armure/create-armure.component';
import { PotionService } from '../../../services/LupinoApi/items/potion.service';
import { Potion } from '../../../models/items/potion';
import { CreatePotionComponent } from '../../modal/create-potion/create-potion.component';
import { CreatePoisonComponent } from '../../modal/create-poison/create-poison.component';
import { Poison } from '../../../models/items/poison';
import { PoisonService } from '../../../services/LupinoApi/items/poison.service';
import { Utilitaire } from '../../../models/items/utilitaire';
import { UtilitaireService } from '../../../services/LupinoApi/items/utilitaire.service';
import { CreateUtilitaireComponent } from '../../modal/create-utilitaire/create-utilitaire.component';
import { Contenant } from '../../../models/items/contenant';
import { ContenantService } from '../../../services/LupinoApi/items/contenant.service';
import { CreateContenantComponent } from '../../modal/create-contenant/create-contenant.component';
import { CreateBazarComponent } from '../../modal/create-bazar/create-bazar.component';
import { BazarService } from '../../../services/LupinoApi/items/bazar.service';
import { Bazar } from '../../../models/items/bazar';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-items',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.css'],
	standalone: false,
})
export class ItemsComponent {
	contenants$!: Observable<Contenant[]>;

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
		this.loadContenants();
		this.checkIfAdmin();

		if (this.router.url.startsWith('/create-character')) {
			this.isInCharacterCreation = true;
		}
	}

	private loadContenants(): void {
		this.contenants$ = this.contenantService.getContenant().pipe(
			catchError(() => of([])),
			shareReplay(1),
		);
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
