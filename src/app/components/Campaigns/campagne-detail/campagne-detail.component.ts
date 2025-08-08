import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampagneService } from '../../../services/LupinoApi/campagne.service';
import { Campagne } from '../../../models/campagne';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNoteModalComponent } from '../../modal/add-note-modal/add-note-modal.component';


@Component({
    selector: 'app-campagne-detail',
    templateUrl: './campagne-detail.component.html',
    styleUrls: ['./campagne-detail.component.css'],
    standalone: false
})
export class CampagneDetailComponent implements OnInit {
    campagne: Campagne | null = null;
    connectedUser: string | null = sessionStorage.getItem('user_id');
    
    constructor(
        private route: ActivatedRoute,
        private campagneService: CampagneService,
        private modalService : NgbModal,
        private router : Router
    ) {}
    
    ngOnInit(): void {
        
        const campagneId = this.route.snapshot.paramMap.get('id');
        if (campagneId) {
            this.loadCampagne(campagneId);
            
        }
    }
    
    loadCampagne(id: string): void {
        this.campagneService.getCampagneById(id).subscribe(
            (data) => {
                if (Object(data)["result"] == "ERROR"){                    
                    //gérer l'erreur
                }else{
                    this.campagne = Object(data)["items"][0]["object"];
                    if (!this.isPlayerInCampagne() && this.campagne?.access !== "public"){ // Si l'utilisateur connecté n'est pas joueur de la campagne et que la campagne n'est pas publique
                        this.router.navigate(["/"]);
                    }else if (this.isPlayerInCampagne() && this.campagne?.access == "private" && this.campagne?.mj._id !== this.connectedUser) {
                        // Si l'utilisateur connecté est joueur de la campagne mais que la campagne est privée
                        this.router.navigate(["/"]);
                    }
                }
            }
        );
    }
    
    addPnjToCampagne(): void {
    }
    
    deleteCampagne(): void { 
    }
    
    editCampagne(): void {}
    
    addNoteToCampagne(): void {
        const modalRef = this.modalService.open(AddNoteModalComponent);
        
        modalRef.result.then((note) => {
            if (note) {
                if (!this.campagne) {
                    return;
                }
                this.campagneService.addNoteToCampagne(this.campagne._id, note).subscribe(
                    (data) => {
                        if (Object(data)["result"] == "ERROR"){                    
                            //gérer l'erreur
                        }else{
                            this.campagne = Object(data)["items"][0]["object"];
                        }
                    }
                );
            }
        }).catch((error) => {
            console.log("Modale fermée sans ajouter de note.");
        });
    }
    
    isPlayerInCampagne(): boolean {
        if (!this.campagne) {
            return false;
        }
        if (!this.connectedUser) {
            return false;
        }
        return this.campagne.personnagesJoueurs.some((pj: any) => pj.owner === this.connectedUser);
    }
    
    // Fonction pour filtrer les notes
    canSeeNote(note: any): boolean {

       
        
        if (!this.connectedUser) {
            return false; // Si l'utilisateur n'est pas connecté, il ne peut pas voir les notes
        }
        if (note.auteur._id === this.connectedUser) {
            
            return true; // Si c'est l'auteur de la note, on peut la voir
        } 
        if (note.type === 'publique') {
            return true; // Les notes publiques sont accessibles à tous
        }
        if (note.type === 'restreinte' && this.isPlayerInCampagne()) {
            return true; // Les notes restreintes sont visibles pour les joueurs de la campagne
        }
        return false; // Sinon, la note n'est pas visible
    }
    
    
}
