import { Component } from '@angular/core';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { UserService } from '../../../services/LupinoApi/user.service';
import { Race } from '../../../models/race';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RaceCreateComponent } from '../../modal/race-create/race-createcomponent';

@Component({
    selector: 'app-races',
    templateUrl: './races.component.html',
    styleUrl: './races.component.css'
})
export class RacesComponent {
    commonRaces: Race[] = [];
    exoticRaces: Race[] = [];
    isAdmin: boolean = false; // Par défaut, pas admin
    userId: string | null = sessionStorage.getItem('user_id');
    isExoticVisible: boolean = false;
    
    constructor(    private modalService: NgbModal, private raceService: RaceService, private userService: UserService) { }
    
    ngOnInit(): void {
        this.loadRaces();
        this.checkIfAdmin();
    }
    
    toggleExoticVisibility() {
        this.isExoticVisible = !this.isExoticVisible;
    }
    
    loadRaces(): void {
        this.raceService.getRaces().subscribe(data => {
            if (Object(data)["result"] == "ERROR"){                    
                // Handle error
            }else{
                let races = Object(data)["items"][0]["object"];
                // Séparation des races en communes et exotiques/inhabituelles
                this.commonRaces = races.filter((race: any) => race.type === 'commune');
                this.exoticRaces = races.filter((race: any) => race.type === 'inhabituelle');
                
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
    
    openCreateRaceModal(): void {
        const modalRef = this.modalService.open(RaceCreateComponent);
        modalRef.result.then((result) => {
            if (result === 'created') {
                this.loadRaces(); // Recharger les races après création
            }
        }, (reason) => {
            console.log('Modale fermée: ', reason);
        });
    }
}
