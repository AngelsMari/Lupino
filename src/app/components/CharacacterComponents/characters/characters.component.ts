import { Component } from '@angular/core';
import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { AuthService } from 'app/services/auth/auth.service';
import { User } from 'app/models/user';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrl: './characters.component.css'
})
export class CharactersComponent {
    
    characters: Character[] = [];
    selectedCharacter: any; // Personnage sélectionné pour suppression
    isSelfCharacter: boolean = false;
    currentUser: User = { _id: '', name: '', mail: '', password:'', isAdmin: false};
    
    constructor(private characterService: CharacterService,private modalService: NgbModal,  private router: Router, private authService: AuthService) {}
    
    ngOnInit(): void {
        if (this.router.url == "/mycharacters") {
            this.isSelfCharacter = true;
            this.authService.getCurrentUser().subscribe(
                response => {
                   if (response.result == "OK") {
                       this.currentUser = response.items[0].object;
                       this.getCharacters();

                   }
                }
            );
        }else{
            this.getCharacters();

        }

    }
    
    getCharacters(): void {
        if (!this.isSelfCharacter){
            
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
            this.characterService.getCharactersByUser(this.currentUser._id).subscribe(res => {
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
            console.log(res);

            if (Object(res)["result"] == "ERROR"){                    
                // Handle error
            }else{
                // Refresh the list of characters
                this.getCharacters();
            }
        });
    }
    
    
    
    
}
