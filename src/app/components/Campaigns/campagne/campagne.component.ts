import { Component } from '@angular/core';
import { CampagneService } from '../../../services/LupinoApi/campagne.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Campagne } from '../../../models/campagne';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { User } from '../../../models/user';
import { UserService } from '../../../services/LupinoApi/user.service';

@Component({
    selector: 'app-campagne',
    templateUrl: './campagne.component.html',
    styleUrl: './campagne.component.css',
    standalone: false
})
export class CampagneComponent {
    campagnes: Campagne[] = [];
    UserId: any;
    
    constructor(private campagneService: CampagneService,private modalService: NgbModal,  private router: Router, private route:ActivatedRoute,private userService:UserService) {}

    ngOnInit(): void {
        this.UserId = this.route.snapshot.paramMap.get('id');
        
        if (this.UserId) {
            this.getCampagnes(this.UserId);
        }else{
            this.getCampagnes(false);
        }

    }

    getCampagnes(id:any): void {
        if (!id){
            
            this.campagneService.getCampagnes().subscribe(res => {
                if (Object(res)["result"] == "ERROR"){                    
                    if (Object(res)["errorId"] == 0){
                        //CREATE NEW USER
                        this.router.navigate(["/profile/new"]);
                    }
                }else{
                    let campagnes = Object(res)["items"][0]["object"];
                    //filter for public access
                    this.campagnes = campagnes.filter((campagne:Campagne) => campagne.access == "public");
                   
                }
                
            });
        } else {
            this.campagneService.getCampagnesByUser(id).subscribe(res => {
                if (Object(res)["result"] == "ERROR"){                    
                    if (Object(res)["errorId"] == 0){
                        //CREATE NEW USER
                        this.router.navigate(["/profile/new"]);
                    }
                }else{
                    this.campagnes = Object(res)["items"][0]["object"];

                }
            });
        }
    }
    
    createNewCampagne() {
        this.router.navigate(['/create-campagne']);
    }

    openDeleteModal(campagne: Campagne) {
        const modalRef = this.modalService.open(DeleteCharacterModalComponent);
        modalRef.componentInstance.character = campagne;
        
        modalRef.componentInstance.confirmDelete.subscribe(() => {
            this.deleteCharacter(campagne._id);
        });
    }

    deleteCharacter(campagneId: string) {
        this.campagneService.deleteCampagne(campagneId).subscribe(res => {
            if (Object(res)["result"] == "ERROR"){                    
                // Handle error
            }else{
                // Refresh the list of characters
                this.campagnes = Object(res)["items"][0]["object"];
            }
        });
    }
}
