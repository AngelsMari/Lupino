import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/models/user';
import { AuthService } from 'app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

    user : User ;
    currentPassword: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    currentUser: User;
    userId: string = sessionStorage.getItem('user_id') || '';
    usernameTaken: boolean = false;
    
    constructor(private authService: AuthService,private router: Router,private toastr: ToastrService) {
        this.user = { _id: '', name: '', mail: '', password: '', jwt: '', isAdmin: false, fcmtoken: '' }; 
        this.currentUser = { _id: '', name: '', mail: '', password: '', jwt: '', isAdmin: false, fcmtoken: '' }; 

    }
    
    ngOnInit(): void {
        if (!this.userId) {
            this.toastr.error("Vous n'avez pas accès à cette page", 'Erreur');
            
            this.router.navigate(['/']);
        }
        this.loadUserInfo();
    }
    
    loadUserInfo() {
        // Chargez les informations de l'utilisateur depuis le service
        this.authService.get(this.userId).subscribe((data: any) => {
            if (data.result == "OK") {
                this.user = data.items[0].object;
                this.currentUser = this.user;
            }
        });
    }
    
    updateUserInfo() {
        if (this.user != this.currentUser) {
            alert('Aucun changement détecté.');
            return;
        }
        this.authService.updateUserInfo(this.user).subscribe(response => {
            if (response.result == "OK") {
                alert('Profil modifié avec succès!');
                //Empty the password fields
                this.loadUserInfo();
            } else {
                alert('Erreur lors des modifications.');
                
            }
        });
    }
    
    changePassword() {
        if (this.newPassword !== this.confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        
        this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(response => {
            if (response.result == "OK") {
                alert('Mot de passe changé avec succès!');
                //Empty the password fields
                this.currentPassword = '';
                this.newPassword = '';
            } else {
                alert('Erreur lors du changement de mot de passe.');
                this.currentPassword = '';
                this.newPassword = '';
            }
        });
    }

    deleteAccount() {
        if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Attention, tous vos personnages seront supprimés.')) {
            this.authService.deleteAccount().subscribe(response => {
                if (response.result == "OK") {
                    alert('Compte supprimé avec succès!');
                    this.authService.logout();
                    this.router.navigate(['/']);
                } else {
                    alert('Erreur lors de la suppression du compte.');
                }
           
            });
        }
    }

    checkUsernameAvailability() {
        if (this.user.name === this.currentUser.name) {
            return;
        }
        this.authService.isUsernameTaken(this.user.name).subscribe(
        (response) => {
            if (response.result == "ERROR") {
                this.usernameTaken = true;
            }
        }
        );
    }
        
}