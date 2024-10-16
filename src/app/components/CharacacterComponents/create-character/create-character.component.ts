import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { Race } from '../../../models/race';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-create-character',
    templateUrl: './create-character.component.html',
    styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent {
    step = 1; // Pour suivre la progression des étapes
    characterForm: FormGroup;
    selectedRace: String = ""; // Stocke la race sélectionnée
    RemainingPoints: number = 135; // Points restants pour les statistiques
    MaximumPoints: number = 150+135; // Points restants pour les statist
    secondaryStats: { constitution: number; resilience: number; reflex: number; charisma: number } | undefined;
    numberOfMasteries: number = 5;
    numberOfLanguages: number = 1;
    numberOfSkills: number = 4;
    skillCount = 4;
    characterId: string | null = null;
    exoticRaces: Array<Race> = [];
    commonRaces: Array<Race> = [];
    
    
    constructor(private fb: FormBuilder, private characterService: CharacterService,private raceService: RaceService, private router: Router, private route: ActivatedRoute) {
        this.characterForm = this.fb.group({
            // Étape 1: Informations de base
            _id : [''],
            name: ['', Validators.required],
            level: [1, [Validators.required, Validators.min(1)]],
            age: [''],
            skincolor: [''],
            height: [''],
            weight: [''],
            sexe: [''],
            eyes: [''],
            hair: [''],
            positive_trait: ['', Validators.required],
            negative_trait: ['', Validators.required],
            
            // Etape 2 : Race
            race: ['', Validators.required],
            
            
            // Étape 3: Statistiques
            strength: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
            agility: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
            endurance: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
            social: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
            mental: [30, [Validators.required, Validators.min(30), Validators.max(85)]],
            
            // Étape 4: Détails supplémentaires
            masteries: this.fb.array([]),
            languages: this.fb.array([]),
            
            // Étape 5: Compétences
            skills: this.fb.array([]),
            
            // Étape 6: Inventaires
            inventory: "",
            gold: [0],
            
            //Champs calculé automatique
            current_hp: [0],
            max_hp: [0],
            current_mana: [0],
            max_mana: [0],
            owner: [sessionStorage.getItem('user_id')],
            isPNJ: [false]
        });
    }
    
    updateCharacter() {
        const { strength, endurance, mental, agility, social } = this.characterForm.value;
        const level = this.characterForm.value.level;
        
        // Calcul de la constitution
        const constitution = Math.floor((strength + endurance) / 10);
        
        // Calcul de la résilience
        const resilience = Math.floor((endurance + mental) / 10);
        
        // Calcul des réflexes
        const reflex = Math.floor((mental + agility) / 10);
        
        // Calcul du charisme
        const charisma = Math.floor((social + Math.max(agility, strength)) / 10);
        
        this.secondaryStats = { constitution, resilience, reflex, charisma };
        
        let numberOfLanguages =1;
        // Update nombres des langues 
        if (this.characterForm.value.social > 40 && this.characterForm.value.social < 61) {
            numberOfLanguages = 2;
        } else {
            numberOfLanguages = 3;
        }
        
        //Si le niveau est pair et différent de 1 on ajoute 1 langues
        let templang = 0;
        if (level < 3) {
            templang =0;
        }else if (level < 5) {
            templang += 1;
        }else if (level < 7 ) {
            templang += 2;
        }else if(level < 9) {
            templang += 3;
        }else {
            templang += 4;
        }

        let multiplicateurLang = 0.5;
        if ( 46 <= social && social < 60) {
            multiplicateurLang = 1;
        }
        if (social >= 60 && social < 75) {
            multiplicateurLang = 2;
        }
        if (social >= 75) {
            multiplicateurLang = 3;
        }

        this.numberOfLanguages = numberOfLanguages+(templang*multiplicateurLang);
        
        // Calcul du nombre de maîtrises 5 + 2 pour chaques stats > 70
        let numberOfMasteries = 5;
        
        if (strength > 70) {
            numberOfMasteries += 2;
        }
        if (agility > 70) {
            numberOfMasteries += 2;
        }
        if (endurance > 70) {
            numberOfMasteries += 2;
        }
        if (social > 70) {
            numberOfMasteries += 2;
        }
        if (mental > 70) {
            numberOfMasteries += 2;
        }
        numberOfMasteries += Math.floor(level / 2);
        this.numberOfMasteries = numberOfMasteries;

        this.numberOfSkills = 4 + Math.floor(level / 2);
        
        this.setMasteries(this.numberOfMasteries);
        this.setLanguages(this.numberOfLanguages);
        this.setSkills(this.numberOfSkills);
        
        
        
        // Points totaux = 150 (base) + 135 (distribution) + niveau modifié
        this.MaximumPoints = 150 + 135 + (Math.floor(level / 2) * 5);
        // Calculer le total restant (par exemple, en fonction de la somme des statistiques)
        this.RemainingPoints = this.MaximumPoints - this.calculateTotalStats();
        
        this.skillCount = 4 + Math.floor(level / 2);
    }


    calculateTotalStats(): number {
        // Calculer la somme des statistiques
        let usedStat = this.characterForm.value.strength + this.characterForm.value.agility + this.characterForm.value.endurance + this.characterForm.value.social + this.characterForm.value.mental;
        return usedStat; // Remplacez par la somme réelle des statistiques
    }
    
    ngOnInit() {
        // Charger les races depuis l'API lors de l'initialisation du composant
        this.raceService.getRaces().subscribe(data => {
            if (Object(data)["result"] == "ERROR"){                    
                // Handle error
            }else{
                let races = Object(data)["items"][0]["object"];

                this.commonRaces = races.filter((race: any) => race.type === 'commune');
                this.exoticRaces = races.filter((race: any) => race.type === 'inhabituelle');
            }
        });
        this.characterId = this.route.snapshot.paramMap.get('id');  // Récupère l'ID du personnage si en mode édition
        if (this.characterId) {
            this.loadCharacterData();  // Charge les données du personnage si en mode édition
        }else{
            this.setMasteries(this.numberOfMasteries);
            this.setLanguages(this.numberOfLanguages);
            this.setSkills(this.skillCount);
        }
        
    }
    
    // Getter pour les FormArray
    get masteries() {
        return this.characterForm.get('masteries') as FormArray;
    }
    
    get languages() {
        return this.characterForm.get('languages') as FormArray;
    }
    
    get skills() {
        return this.characterForm.get('skills') as FormArray;
    }
    
    loadCharacterData() {
        if (this.characterId) {
            this.characterService.getCharacterById(this.characterId).subscribe(character => {
                character = Object(character)["items"][0]["object"];
                this.characterForm.patchValue({
                    name: character.name,
                    age: character.age,
                    level: character.level,
                    skincolor: character.skincolor,
                    height: character.height,
                    weight: character.weight,
                    sexe: character.sexe,
                    eyes: character.eyes,
                    hair: character.hair,
                    positive_trait: character.positive_trait,
                    negative_trait: character.negative_trait,
                    inventory: character.inventory,
                    gold: character.gold,
                    strength: character.strength,
                    agility: character.agility,
                    endurance: character.endurance,
                    social: character.social,
                    mental: character.mental,
                });
                
                // Remplir les tableaux de maîtrises, langues et compétences
                this.setFormArray('masteries', character.masteries);
                this.setFormArray('languages', character.languages);
                this.setSkillsFormArray(character.skills);
                this.selectRace(character.race);
                this.calculateTotalStats();
                this.updateCharacter();
            });
        }
    }
    // Fonction utilitaire pour peupler un FormArray
    setFormArray(arrayName: string, values: string[]) {
        const formArray = this.characterForm.get(arrayName) as FormArray;
        formArray.clear();  // Vide les anciennes données
        
        values.forEach(value => {
            formArray.push(this.fb.control(value));
        });
    }
    
    // Remplit le tableau de compétences
    setSkillsFormArray(skills: any[]) {
        const skillsFormArray = this.characterForm.get('skills') as FormArray;
        skillsFormArray.clear();  // Vide les anciennes compétences
        
        skills.forEach(skill => {
            skillsFormArray.push(
                this.fb.group({
                    name: [skill.name, Validators.required],
                    description: [skill.description, Validators.required],
                    effects: [skill.effects, Validators.required],
                    cost: [skill.cost, Validators.required]
                })
            );
        });
    }
    
    // Gère l'ajout d'une nouvelle maîtrise/langue
    addMastery() {
        (this.characterForm.get('masteries') as FormArray).push(this.fb.control(''));
    }
    
    addLanguage() {
        (this.characterForm.get('languages') as FormArray).push(this.fb.control(''));
    }
    
    // Gère l'ajout d'une compétence
    addSkill() {
        (this.characterForm.get('skills') as FormArray).push(
            this.fb.group({
                name: ['', Validators.required],
                description: ['', Validators.required],
                effects: ['', Validators.required],
                cost: ['', Validators.required]
            })
        );
    }

    // Méthode pour ajouter des maîtrises
    setMasteries(count: number) {
        for (let i = this.masteries.length; i < count; i++) {
            this.masteries.push(this.fb.control('Materies'+i, Validators.required));
        }
    }
    
    // Méthode pour ajouter des langues
    setLanguages(count: number) {
        for (let i = this.languages.length; i < count; i++) {
            this.languages.push(this.fb.control('langues'+i, Validators.required));
        }
    }
    
    // Méthode pour ajouter des compétences
    setSkills(count: number) {
        for (let i = this.skills.length; i < count; i++) {
            this.skills.push(this.fb.group({
                name: ['Nom', Validators.required],
                description: ['Description', Validators.required],
                effects: ['Effet', Validators.required],
                cost: ['Cout', Validators.required],
            }));
        }
    }
    
    // Naviguer vers l'étape suivante
    nextStep() {
        if (this.step < 6) {
            this.step++;
        }
    }
    
    // Revenir à l'étape précédente
    previousStep() {
        if (this.step > 1) {
            this.step--;
        }
    }
    
    selectRace(race: String) {
        this.selectedRace = race;
        this.characterForm.patchValue({ race: race });
    }
    
    
    // Soumettre le formulaire une fois toutes les étapes complétées
    onSubmit() {
        if (this.characterForm.valid) {
            // On définit HP et Mana
            let hp = (this.characterForm.value.endurance/10)  + 10;
            hp = Math.floor(hp);
            // Foreach level we add 9 hp si endu>= 50, 12 si endu >= 70 et sinon 6
            let level = this.characterForm.value.level;
            let hpForLevelUp = 6;
            if (this.characterForm.value.endurance >= 70) {
                hpForLevelUp = 12;
            } else if (this.characterForm.value.endurance >= 50) {
                hpForLevelUp = 9;
            } 
            //Check if Endurance est la stat la plus haute
            if (this.characterForm.value.endurance == Math.max(this.characterForm.value.agility, this.characterForm.value.endurance, this.characterForm.value.strength,this.characterForm.value.mental,this.characterForm.value.social)) {
                hpForLevelUp += 1;
            }
            
            hp += (level-1)*hpForLevelUp;
            this.characterForm.patchValue({ current_hp: hp});
            this.characterForm.patchValue({ max_hp: hp });
            
            // Mana c'est (Mental + caractéristique la plus haute /10
            let mana = this.characterForm.value.mental;
            mana += Math.max(this.characterForm.value.agility, this.characterForm.value.endurance, this.characterForm.value.strength,this.characterForm.value.mental,this.characterForm.value.social);
            mana = Math.floor(mana/10);
            let manaForLevelUp = 5;
            if (this.characterForm.value.mental >= 70) {
                manaForLevelUp = 10;
            } else if (this.characterForm.value.mental >= 50) {
                manaForLevelUp = 8;
            }
            //Check if Mental est la stat la plus haute
            if (this.characterForm.value.mental == Math.max(this.characterForm.value.agility, this.characterForm.value.endurance, this.characterForm.value.strength,this.characterForm.value.mental,this.characterForm.value.social)) {
                manaForLevelUp += 1;
            }
            mana += (level-1)*manaForLevelUp;
            this.characterForm.patchValue({ current_mana: Math.floor(mana) });
            this.characterForm.patchValue({ max_mana: Math.floor(mana) });
            
            
            if (this.characterId) {
                this.characterForm.patchValue({ _id: this.characterId });
                this.characterService.updateCharacter(this.characterForm.value).subscribe(data => {
                    if (Object(data)["result"] == "ERROR"){                    
                        // Handle error
                    }else{
                        // Handle success
                        this.router.navigate(['/mycharacters', sessionStorage.getItem('user_id')]);
                    }
                });
            } else {
                console.log(this.characterForm.value);
                this.characterService.createCharacter(this.characterForm.value).subscribe(data => {
                    if (Object(data)["result"] == "ERROR"){                    
                        // Handle error
                    }else{
                        // Handle success
                        this.router.navigate(['/mycharacters', sessionStorage.getItem('user_id')]);
                    }
                });
            }
        }
        else {
            console.log("Formulaire invalide");
            console.log(this.characterForm.errors);   
            console.log(this.characterForm    );
        }
    }

    
}