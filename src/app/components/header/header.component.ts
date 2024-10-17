import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean=false;

  constructor(private authService: AuthService){
  }

  ngOnInit() {
    
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.authService.isLoggedIn.subscribe((data: boolean) => {
      this.isLoggedIn = data;
    });
  }

  logout(){
    this.authService.logout().subscribe( data => {
      this.checkIfLoggedIn();

      console.log('data',data);
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Ajustez le nom du cookie si nécessaire
      sessionStorage.removeItem('token'); // Optionnel : supprimer le token du sessionStorage si nécessaire
      sessionStorage.removeItem('user_id'); // Supprimer l'ID utilisateur du sessionStorage si nécessaire
    });
  }
}
