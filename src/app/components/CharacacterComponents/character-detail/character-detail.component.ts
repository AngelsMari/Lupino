import { Component } from '@angular/core';
import { Character } from '../../../models/character';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent {
  character: Character | undefined;
  secondaryStats: { constitution: number; resilience: number; reflex: number; charisma: number } | undefined;
  bonuses: { [key: string]: string } = {};
  user_id: string | null = null;
  sessionActive: boolean = false;
  characterForm: FormGroup = this.fb.group({
    current_hp: [''],
    current_mana: [''],
    inventory: ""
  });
  
  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService, private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private r: Router
  ) { }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    //get Current User
    if (id) {
      this.authService.getCurrentUser().subscribe((data: any) => {
        if (data.result == "OK") {
            console.log(data);
            this.user_id = data.items[0].object._id;
            this.loadCharacter(id);

        }else{
          this.loadCharacter(id);
        }
      });

    }
  }
  // Méthode pour commencer la session
  startSession() {
    this.sessionActive = true;
    this.enableFormControls();  // Active les champs du formulaire
    
  }
  
  // Méthode pour terminer la session
  endSession() {
    this.sessionActive = false;
    this.disableFormControls();  // Désactive les champs du formulaire
    
  }
  
  loadCharacter(id: string): void {
    this.characterService.getCharacterById(id).subscribe(data => {
      if (Object(data)["result"] == "ERROR"){
        console.log(data);
      }else{
        //On vérifie si on a le droit de voir le personnage
        
        if (this.user_id != Object(data)["items"][0]["object"]?.owner._id && !Object(data)["items"][0]["object"]?.isPublic){
          //Notification toastr pas d'accès
          this.toastr.error("Vous n'avez pas accès à ce personnage");
          this.r.navigate(['/characters']);
        }
        this.character = Object(data)["items"][0]["object"];

        
        this.calculateSecondaryStats();
        this.calculateBonuses();
        this.initializeForm();
      }
      
    });
  }
  
  calculateSecondaryStats(): void {
    if (!this.character) return;
    
    const { strength, endurance, mental, agility, social } = this.character;
    
    // Calcul de la constitution
    const constitution = Math.floor((strength + endurance) / 10);
    
    // Calcul de la résilience
    const resilience = Math.floor((endurance + mental) / 10);
    
    // Calcul des réflexes
    const reflex = Math.floor((mental + agility) / 10);
    
    // Calcul du charisme
    const charisma = Math.floor((social + Math.max(agility, strength)) / 10);
    
    this.secondaryStats = { constitution, resilience, reflex, charisma };
  }
  
  calculateBonuses(): void {
    if (!this.character) return;
    
    // Calcul des bonus/malus pour les statistiques principales
    this.bonuses = {
      strength: this.getBonus(this.character.strength),
      agility: this.getBonus(this.character.agility),
      endurance: this.getBonus(this.character.endurance),
      social: this.getBonus(this.character.social),
      mental: this.getBonus(this.character.mental),
    };
  }
  
  getBonus(value: number): string {
    if (value < 30) return "-2";
    if (value < 50) return "-1";
    if (value < 60) return "0";
    if (value < 70) return "+1";
    return "+2";
  }

  initializeForm(): void {
    if (!this.character) return;
    
    // Initialise les HP et le Mana
    this.characterForm.patchValue({
      current_hp: this.character.current_hp,
      current_mana: this.character.current_mana,
      inventory: this.character.inventory
    });
    
    
    
    // Désactive les champs par défaut (modification seulement en session)
    this.disableFormControls();
  }
  formatText(text: any): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }
  // Active les champs du formulaire (pendant une session)
  enableFormControls(): void {
    this.characterForm.get('current_hp')?.enable();
    this.characterForm.get('current_mana')?.enable();
  }
  
  // Désactive les champs du formulaire (hors session)
  disableFormControls(): void {
    this.characterForm.get('current_hp')?.disable();
    this.characterForm.get('current_mana')?.disable();
   
  }
  
  // Mise à jour des HP via le formulaire
  modifyHp(amount: any): void {
    if (amount === 'max') {
      this.characterForm.patchValue({
        current_hp: this.character?.max_hp
      });
      return;
    }
    const currentHp = this.characterForm.get('current_hp')?.value;
    this.characterForm.patchValue({
      current_hp: Math.min(this.character?.max_hp || 0, currentHp + amount)
    });
  }
  
  // Mise à jour du Mana via le formulaire
  modifyMana(amount: any): void {
    if (amount === 'max') {
      this.characterForm.patchValue({
        current_mana: this.character?.max_mana
      });
      return;
    }
    const currentMana = this.characterForm.get('current_mana')?.value;
    this.characterForm.patchValue({
      current_mana: Math.max(0, Math.min(this.character?.max_mana || 0, currentMana + amount))
    });
  }
  
  // Ajout d'un item à l'inventaire
  addInventoryItem(): void {
    const inventoryFormArray = this.characterForm.get('inventory') as FormArray;
    inventoryFormArray.push(this.fb.group({
      name: ['Nouvel item'],
      quantity: [1]
    }));
  }
  
  // Suppression d'un item de l'inventaire
  removeInventoryItem(index: number): void {
    const inventoryFormArray = this.characterForm.get('inventory') as FormArray;
    inventoryFormArray.removeAt(index);
  }

  toggleVisibility() {
    if (this.character) {
        this.character.isPublic = !this.character.isPublic;
        this.characterService.updateCharacter(this.character).subscribe(data => {
            if (Object(data)["result"] == "ERROR"){
                console.log(data);
            }else{
              let id = this.route.snapshot.paramMap.get('id');
              if (id) {
                this.loadCharacter(id);
              }
            }
        });
        // Ajoute ici la logique pour sauvegarder ce changement dans la base de données si nécessaire
        console.log(`Le personnage est maintenant ${this.character.isPublic ? 'public' : 'privé'}.`);
    }
}
  
}
