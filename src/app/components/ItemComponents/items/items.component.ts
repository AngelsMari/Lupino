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


@Component({
	selector: 'app-items',
	templateUrl: './items.component.html',
	styleUrl: './items.component.css'
})
export class ItemsComponent {
	armescac: Arme[] = [];
	distance: Arme[] = [];
	siege: Arme[] = [];
	explosif: Arme[] = [];
	armurelegere: Armure[] = [];
	armureinter: Armure[] = [];
	armurelourde: Armure[] = [];
	potions: Potion[] = [];
	poisons: Poison[] = [];
	utilitaires: Utilitaire[] = [];
	contenant: Contenant[] = [];
	bazars: Bazar[] = [];
	isAdmin: boolean = false; // Par défaut, pas admin
	searchText: string = ''; // Texte de recherche
	userId: string | null = sessionStorage.getItem('user_id');
	
	
	constructor( 
		private modalService: NgbModal, 
		private armeService: ArmeService, 
		private userService: UserService, 
		private armureService: ArmureService, 
		private potionService: PotionService,
		private poisonService: PoisonService,
		private utilitaireService: UtilitaireService,
		private contenantService: ContenantService,
		private bazarService: BazarService
	
	) { }
	
	ngOnInit(): void {
		this.loadArmes();
		this.loadArmures();
		this.loadPotions();
		this.loadPoisons();
		this.loadUtilitaires();
		this.loadContenants();
		this.loadBazars();
		this.checkIfAdmin();
	}
	
	loadArmes(): void {
		this.armeService.getArmes().subscribe(data => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				let armes = Object(data)["items"][0]["object"];
				this.armescac = armes.filter((arme: any) => arme.categorie === 'cac');
				this.distance = armes.filter((arme: any) => arme.categorie === 'distance');
				this.siege = armes.filter((arme: any) => arme.categorie === 'siege');
				this.explosif = armes.filter((arme: any) => arme.categorie === 'explosif');
			}
		});
	}
	
	loadArmures(): void {
		this.armureService.getArmures().subscribe((data) => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				let armure = Object(data)["items"][0]["object"];
				this.armurelegere = armure.filter((armure: any) => armure.categorie === 'légère');
				this.armureinter = armure.filter((armure: any) => armure.categorie === 'intermédiaire');
				this.armurelourde = armure.filter((armure: any) => armure.categorie === 'lourde');
			}
		});
	}
	
	loadPotions(): void {
		this.potionService.getPotions().subscribe(data => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				this.potions = Object(data)["items"][0]["object"];
			}
		});
	}

	loadPoisons(): void {
		this.poisonService.getPoisons().subscribe(data => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				this.poisons = Object(data)["items"][0]["object"];
			}
		});
	}

	loadUtilitaires(): void {
		this.utilitaireService.getUtilitaires().subscribe((data) => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				this.utilitaires = Object(data)["items"][0]["object"];
			}
		});
	}

	loadContenants(): void {
		this.contenantService.getContenant().subscribe((data) => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				this.contenant = Object(data)["items"][0]["object"];
			}
		});
	}

	loadBazars() {
		this.bazarService.getBazars().subscribe((data:any) => {
			if (Object(data)["result"] == "ERROR"){                    
				// Handle error
			}else{
				this.bazars = Object(data)["items"][0]["object"];
			}
		});
	}
	
	checkIfAdmin(): void {
		if (this.userId) {
			this.userService.getUserById(this.userId).subscribe(data => {
				if (Object(data)["result"] == "ERROR"){
					// Handle error
				}else {
					let user = Object(data)["items"][0]["object"];
					if (user && user.isAdmin === true) {
						this.isAdmin = true;
					}
				}
			});
		}
	}
	
	// Filtrage des armes corps à corps
	get filteredArmesCac() {
		return this.armescac.filter(arme => this.matchSearchArme(arme));
	}
	
	// Filtrage des armes à distance
	get filteredDistance() {
		return this.distance.filter(arme => this.matchSearchArme(arme));
	}
	
	// Filtrage des armes de siège
	get filteredSiege() {
		return this.siege.filter(arme => this.matchSearchArme(arme));
	}
	
	// Filtrage des explosifs
	get filteredExplosif() {
		return this.explosif.filter(arme => this.matchSearchArme(arme));
	}

	get filteredArmuresLeg() {
		return this.armurelegere.filter(armure => this.matchSearchArmure(armure));
	}

	get filteredArmuresInter() {
		return this.armureinter.filter(armure => this.matchSearchArmure(armure));
	}

	get filteredArmuresLourdes() {
		return this.armurelourde.filter(armure => this.matchSearchArmure(armure));
	}

	get filteredPotions() {
		return this.potions.filter(potion => this.matchSearchPotion(potion));
	}

	get filteredPoisons() {
		return this.poisons.filter(poison => this.matchSearchPotion(poison));
	}

	get filteredUtilitaires() {
		return this.utilitaires.filter(utilitaire => this.matchSearchPotion(utilitaire));
	}

	get filteredContenants() {
		return this.contenant.filter(contenant => this.matchSearchPotion(contenant));
	}

	get filteredBazars() {
		return this.bazars.filter(bazar => this.matchSearchPotion(bazar));
	}

	// Méthode de correspondance pour la recherche
	matchSearchArme(arme: Arme): any {
		const searchTerm = this.searchText.toLowerCase();
		return (
			arme.nom.toLowerCase().includes(searchTerm) ||
			arme.type.toLowerCase().includes(searchTerm) ||
			arme.effet?.toLowerCase().includes(searchTerm) ||
			arme.degats?.toString().includes(searchTerm) ||
			arme.portee?.toString().includes(searchTerm) ||
			arme.prix?.toString().includes(searchTerm) ||
			(arme.munitions?.toString().includes(searchTerm) || arme.prixMunitions?.toString().includes(searchTerm))
		);
	}

	matchSearchArmure(armure: Armure): any {
		const searchTerm = this.searchText.toLowerCase();
		return (
			armure.nom.toLowerCase().includes(searchTerm) ||
			armure.description.toLowerCase().includes(searchTerm) ||
			armure.statistiques?.toLowerCase().includes(searchTerm) ||
			armure.prix?.toString().includes(searchTerm)
		);
	}

	matchSearchPotion(potion: any): any {
		
		const searchTerm = this.searchText.toLowerCase();
		return (
			potion.nom.toLowerCase().includes(searchTerm) ||
			potion.effet?.toLowerCase().includes(searchTerm) ||
			potion.prix?.toString().includes(searchTerm)
		);
	}
	
	openCreateArmeModal(): void {
		const modalRef = this.modalService.open(CreateArmeComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadArmes(); // Recharger les races après création
			}
		}, (reason) => {
			console.log('Modale fermée: ', reason);
		});
	}

	openCreateArmureModal(): void {
		const modalRef = this.modalService.open(CreateArmureComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadArmures(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			
		});
	}

	openCreatePotionModal(): void {
		const modalRef = this.modalService.open(CreatePotionComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadPotions(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			
		});
	}

	openCreatePoisonModal(): void {
		const modalRef = this.modalService.open(CreatePoisonComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadPoisons(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			
		});
	}

	openCreateUtilitaireModal(): void {
		const modalRef = this.modalService.open(CreateUtilitaireComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadUtilitaires(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			
		});
	}

	openCreateContenantModal(): void {
		const modalRef = this.modalService.open(CreateContenantComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadContenants(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			
		});
	}

	openCreateBazarModal(): void {
		const modalRef = this.modalService.open(CreateBazarComponent);
		modalRef.result.then((result) => {
			if (result === 'created') {
				this.loadBazars(); // Recharger
			}}, (reason) => {
				console.log('Modale fermée: ', reason);
			});
	}
	
	
}
