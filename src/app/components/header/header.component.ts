import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;
  userId: string = "";

  constructor(private authService: AuthService){
  }

  ngOnInit() {
    if (sessionStorage.getItem("token")){
      this.authService.loggedIn.next(true);
      this.userId = sessionStorage.getItem("user_id") || "";
    }
    this.isLoggedIn$ = this.authService.isLoggedIn;
    
  }

  logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    this.authService.logout();
  }
}
