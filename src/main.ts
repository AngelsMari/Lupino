import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { initApp } from './app/app.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/auth.interceptor';
import { AuthGuard } from './app/services/auth/auth.guard';
import { AuthService } from './app/services/auth/auth.service';
import { UserService } from './app/services/LupinoApi/user.service';
import { LOCALE_ID, importProvidersFrom } from '@angular/core';
import { AdminGuard } from './app/services/auth/admin.guard';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, MatButtonModule, MatInputModule, MatSliderModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule, QuillModule.forRoot(), // Ajouter ce module
        ToastrModule.forRoot({
            positionClass: 'toast-top-center', // Changer cette ligne pour centrer les notifications
            timeOut: 3000, // Temps avant que la notification disparaisse (en ms)
            preventDuplicates: true, // Prévenir les notifications dupliquées
        })),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AuthGuard,
        AuthService,
        UserService,
        { provide: LOCALE_ID, useValue: 'fr' },
        AdminGuard,
        provideAnimations(),
    ]
})
  .catch(err => console.error(err));
