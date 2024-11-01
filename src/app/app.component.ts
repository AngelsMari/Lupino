import { Component } from '@angular/core';
import { UserService } from './services/LupinoApi/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Lupino';

  constructor(private userService: UserService) {}


  ngOnInit() {
    // Appeler une méthode du UserService pour s'assurer qu'il est chargé
    this.userService.getUserData().subscribe(data => {
    });
}
}
