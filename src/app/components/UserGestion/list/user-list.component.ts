import { Component } from '@angular/core';
import { User } from 'app/models/user';
import { UserPublicData } from 'app/models/userpublicdata';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: UserPublicData[] = [];

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
      this.loadUsers();
  }

  loadUsers(): void {
      this.userService.getUsers().subscribe(data => {
        if (Object(data)["result"] == "ERROR"){                    
            // Handle error
          
        }else{
            this.users = Object(data)["items"][0]["object"];
        }
      });
  }

  

  toggleMj(user: UserPublicData): void {
      // Implémentez la logique pour rétrograder l'utilisateur du rôle de MJ
      this.toastr.success('Utilisateur rétrogradé de MJ');
  }

  toggleAdminRole(user: UserPublicData): void {
      // Implémentez la logique pour promouvoir l'utilisateur au rôle d'Admin
      this.toastr.success('Utilisateur promu en Admin');
  }


  suspendUser(user: UserPublicData): void {
      // Implémentez la logique pour suspendre l'utilisateur
      this.toastr.success('Utilisateur suspendu');
  }
}
