import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { UserService } from '../../../services/LupinoApi/user.service';
import { CampagneService } from '../../../services/LupinoApi/campagne.service';
import { Character } from '../../../models/character';

@Component({
    selector: 'app-create-campagne',
    templateUrl: './create-campagne.component.html',
    styleUrl: './create-campagne.component.css'
})
export class CreateCampagneComponent {
    campagneForm: FormGroup;
    users: any[] = []; // Utilisateurs disponibles
    allPersonnages: Character[] = []; // Liste complète des personnages
    searchPJ: string = ''; // Valeur de recherche pour les PJs
    searchPNJ: string = ''; // Valeur de recherche pour les PNJs
    filteredPJ: Character[] = []; // Liste des PJs filtrés
    filteredPNJ: Character[] = []; // Liste des PNJs filtrés
    selectedPJs: Character[] = []; // Liste des PJs sélectionnés
    selectedPNJs: Character[] = []; // Liste des PNJs sélectionnés
    errors: string = "";
    
    constructor(
        private fb: FormBuilder,
        private campagneService: CampagneService,
        private personnageService: CharacterService,
        private userService: UserService
    ) {
        this.campagneForm = this.fb.group({
            nom: ['', Validators.required],
            mj: [sessionStorage.getItem('user_id')], // MJ par défaut
            personnagesJoueurs: [''],
            pnjs: [''],
            speech: ['']
        });
    }
    
    ngOnInit(): void {
        this.loadData();
    }
    
    loadData(): void {
        // Charger les utilisateurs
        this.userService.getUsers().subscribe(users => {
            this.users = users;
        });
        
        // Charger les personnages et les filtrer
        this.personnageService.getCharacters().subscribe((data:any) => {
            if (data['result'] === 'ERROR') {
                // Gérer l'erreur ici
                console.error('Erreur lors de la création de la potion', data);
                return;
            }else{
                this.allPersonnages = Object(data)["items"][0]["object"];
                
            }
        });
        
    }
    
    // Recherche des PJs (personnages qui ne sont pas PNJ)
    onSearchPJ(event: Event): void {
        const searchValue = (event.target as HTMLInputElement).value;

        this.filteredPJ = this.allPersonnages.filter(p => 
            !p.isPNJ && p.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
    
    // Recherche des PNJs
    onSearchPNJ(event: Event): void {
        const searchValue = (event.target as HTMLInputElement).value;

        this.filteredPNJ = this.allPersonnages.filter(p => 
            p.isPNJ && p.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
    
    // Ajouter un PJ sélectionné
    addPJ(pj: any): void {
        if (!this.selectedPJs.includes(pj)) {
            this.selectedPJs.push(pj);
        }
        this.searchPJ = ''; // Réinitialiser le champ de recherche
        this.filteredPJ = []; // Réinitialiser la liste filtrée
    }
    
    // Ajouter un PNJ sélectionné
    addPNJ(pnj: any): void {
        if (!this.selectedPNJs.includes(pnj)) {
            this.selectedPNJs.push(pnj);
        }
        this.searchPNJ = ''; // Réinitialiser le champ de recherche
        this.filteredPNJ = []; // Réinitialiser la liste filtrée
    }
    
    // Retirer un PJ sélectionné
    removePJ(pj: any): void {
        this.selectedPJs = this.selectedPJs.filter(p => p !== pj);
    }
    
    // Retirer un PNJ sélectionné
    removePNJ(pnj: any): void {
        this.selectedPNJs = this.selectedPNJs.filter(p => p !== pnj);
    }
    
    onSubmit() {
        // Push l'id des personnages sélectionnés dans le formulaire
        this.campagneForm.patchValue({
            personnagesJoueurs: this.selectedPJs.map(p => p._id),
            pnjs: this.selectedPNJs.map(p => p._id)
        });

        if (this.campagneForm.valid) {
            console.log('Formulaire valide', this.campagneForm.value);
            this.campagneService.create(this.campagneForm.value).subscribe((response:any) => {
                if (response['result'] === 'ERROR') {
                    switch (response['errorId']) {
                        case 403:
                            this.errors = 'Le token est manquant ou invalide';
                            break;
                        default:
                            this.errors = 'Une erreur est survenue';
                            break;
                    }
                    // Gérer l'erreur ici
                    return;
                }else{
                    console.log('Campagne créée', response);

                }
            });
        }
    }
}
