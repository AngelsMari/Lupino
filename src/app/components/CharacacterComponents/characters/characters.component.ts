import { Component } from '@angular/core';
import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { UserPublicData } from 'app/models/userpublicdata';
import { first, forkJoin } from 'rxjs';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrl: './characters.component.css'
})
export class CharactersComponent {
    
    characters: Character[] = [];
    selectedCharacter: any; // Personnage sélectionné pour suppression
    isSelfCharacter: boolean = false;
    currentUser: UserPublicData = { _id: '', name: '', mail: '', isAdmin: false, isSuperAdmin: false, isMJ: false };
    
    constructor(private characterService: CharacterService,private modalService: NgbModal,  private router: Router, private authService: AuthService, private userService: UserService) {}
    
    ngOnInit(): void {
        if (this.router.url == "/mycharacters") {
            this.userService.isUserLoaded().subscribe(isLoaded => {
                if (isLoaded) {
                    this.userService.getUserData().subscribe(data => {
                        this.currentUser = data;
                    });
                    
                    this.isSelfCharacter = true;
                    this.getCharactersByUser();
                    
                }
            });
        } else {
            this.userService.getUserData().subscribe(data => {
                this.currentUser = data;
            });
            this.getCharacters();
        }
        
    }
    
    getCharacters(): void {
        
        this.characterService.getCharacters().subscribe(res => {
            if (Object(res)["result"] == "ERROR"){                    
                // Handle error
            }else{
                if (this.currentUser.isAdmin) {
                    
                    this.characters = Object(res)["items"][0]["object"];
                } else {
                    this.characters = Object(res)["items"][0]["object"].filter((character: Character) => character.isPublic == true);
                }
            }
        });
    }
    
    getCharactersByUser(): void {
        console.log(this.currentUser);

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
