import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPublicData } from 'app/models/userpublicdata';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

    user : UserPublicData = { _id: '', name: '', mail: '', isAdmin: false };
    currentPassword: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    usernameTaken: boolean = false;
    currentUser: UserPublicData = { _id: '', name: '', mail: '', isAdmin: false };

    constructor(private authService: AuthService,private router: Router,private toastr: ToastrService, private userService: UserService) {
    }
    
    ngOnInit(): void {

        this.userService.getUserData().subscribe(data => {
            this.user = data;
            this.currentUser = data;
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
                this.userService.getUserData().subscribe(data => {
                    this.user = data;
                    this.currentUser = data;
                });
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

        // length de 6 minimum
        if (this.newPassword.length < 6) {
            alert('Le mot de passe doit contenir au moins 6 caractères.');
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
