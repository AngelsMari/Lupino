import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    error:boolean = false;
    
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private toastr: ToastrService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }
    
    onSubmit(): void {
        
        
        if (this.loginForm.valid) {
            const email = this.loginForm.value.email;
            const password = this.loginForm.value.password;
            // Appeler le service d'authentification ici
            this.authService.login(email, password).subscribe(
                data => {
                    if (Object(data)["result"] == "ERROR"){
                        this.error = true;
                    }else{
                        this.authService.loggedIn.next(true);
                        this.toastr.success('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Succès');
                        
                        this.router.navigate(['/']);
                        
                    }
                }
            );

        }
    }
}