import { Component } from '@angular/core';
import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrl: './characters.component.css'
})
export class CharactersComponent {
    
    characters: Character[] = [];
    UserId: any;
    selectedCharacter: any; // Personnage sélectionné pour suppression
    
    
    constructor(private characterService: CharacterService,private modalService: NgbModal,  private router: Router, private route:ActivatedRoute) {}
    
    ngOnInit(): void {
        this.UserId = this.route.snapshot.paramMap.get('id');
        
        if (this.UserId) {
            this.getCharacters(this.UserId);
        }else{
            this.getCharacters(false);
        }
    }
    
    getCharacters(id:any): void {
        if (!id){
            
            this.characterService.getCharacters().subscribe(res => {
                if (Object(res)["result"] == "ERROR"){                    
                    if (Object(res)["errorId"] == 0){
                        //CREATE NEW USER
                        this.router.navigate(["/profile/new"]);
                    }
                }else{
                    let characters = Object(res)["items"][0]["object"];
                    //get access public
                    this.characters = characters.filter((character:Character) => character.isPublic == true);
                }
                
            });
        } else {
            this.characterService.getCharactersByUser(id).subscribe(res => {
                if (Object(res)["result"] == "ERROR"){                    
                    if (Object(res)["errorId"] == 0){
                        //CREATE NEW USER
                        this.router.navigate(["/profile/new"]);
                    }
                }else{
                    this.characters = Object(res)["items"][0]["object"];
                }
            });
        }
    }
    
    createNewCharacter() {
        this.router.navigate(['/create-character']);
    }
    
    openDeleteModal(character: Character) {
        const modalRef = this.modalService.open(DeleteCharacterModalComponent);
        modalRef.componentInstance.character = character;
        
        modalRef.componentInstance.confirmDelete.subscribe(() => {
            this.deleteCharacter(character._id);
        });
    }
    
    deleteCharacter(characterId: string) {
        this.characterService.deleteCharacter(characterId).subscribe(res => {
            if (Object(res)["result"] == "ERROR"){                    
                // Handle error
            }else{
                // Refresh the list of characters
                this.characters = Object(res)["items"][0]["object"];
            }
        });
    }
    
    
    
    
}
