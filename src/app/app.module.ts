import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http'; // Assurez-vous que ceci est importé
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CharactersComponent } from './components/CharacterComponents/characters/characters.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { CharacterDetailComponent } from './components/CharacterComponents/character-detail/character-detail.component';
import { LoginComponent } from './components/UserGestion/login/login.component';
import { RegisterComponent } from './components/UserGestion/register/register.component';
import { DeleteCharacterModalComponent } from './components/modal/delete-character/delete-character.component';
import { CreateCharacterComponent } from './components/CharacterComponents/create-character/create-character.component';
import { RacesComponent } from './components/RaceComponents/races/races.component';
import { ItemsComponent } from './components/ItemComponents/items/items.component';
import { RaceCreateComponent } from './components/modal/race-create/race-createcomponent';
import { CreateArmeComponent } from './components/modal/create-arme/create-arme.component';
import { CreateArmureComponent } from './components/modal/create-armure/create-armure.component';
import { CreatePotionComponent } from './components/modal/create-potion/create-potion.component';
import { CreatePoisonComponent } from './components/modal/create-poison/create-poison.component';
import { CreateUtilitaireComponent } from './components/modal/create-utilitaire/create-utilitaire.component';
import { CreateContenantComponent } from './components/modal/create-contenant/create-contenant.component';
import { CreateBazarComponent } from './components/modal/create-bazar/create-bazar.component';
import { QuillModule } from 'ngx-quill';
import { CreateCampagneComponent } from './components/Campaigns/create-campagne/create-campagne.component';
import { CampagneComponent } from './components/Campaigns/campagne/campagne.component';
import { CampagneDetailComponent } from './components/Campaigns/campagne-detail/campagne-detail.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AddNoteModalComponent } from './components/modal/add-note-modal/add-note-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './components/footer/footer.component';
import { ConfidentialiteComponent } from './components/pages/confidentialite/confidentialite.component';
import { MentionsLegalesComponent } from './components/pages/mentions-legales/mentions-legales.component';
import { LoreComponent } from './components/pages/lore/lore.component';
import { ProfilComponent } from './components/UserGestion/profil/profil.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
registerLocaleData(localeFr, 'fr');
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserListComponent } from './components/UserGestion/list/user-list.component';
import { AdminGuard } from './services/auth/admin.guard';
import { UserService } from './services/LupinoApi/user.service';
import { PasswordForgottenComponent } from './components/UserGestion/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from './components/UserGestion/reset-password/reset-password.component';
import { ArmeComponentComponent } from './components/ItemsComponents/arme-component/arme-component.component';
import { ArmureComponentComponent } from './components/ItemsComponents/armure-component/armure-component.component';
import { PotionComponentComponent } from './components/ItemsComponents/potion-component/potion-component.component';
import { PoisonComponentComponent } from './components/ItemsComponents/poison-component/poison-component.component';
import { UtilitaireComponentComponent } from './components/ItemsComponents/utilitaire-component/utilitaire-component.component';
import { ContenantComponentComponent } from './components/ItemsComponents/contenant-component/contenant-component.component';
import { BazarComponentComponent } from './components/ItemsComponents/bazar-component/bazar-component.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		CharactersComponent,
		HeaderComponent,
		CharacterDetailComponent,
		LoginComponent,
		RegisterComponent,
		CreateCharacterComponent,
		DeleteCharacterModalComponent,
		RacesComponent,
		ItemsComponent,
		RaceCreateComponent,
		CreateArmeComponent,
		CreateArmureComponent,
		CreatePotionComponent,
		CreatePoisonComponent,
		CreateUtilitaireComponent,
		CreateContenantComponent,
		CreateBazarComponent,
		CreateCampagneComponent,
		CampagneComponent,
		CampagneDetailComponent,
		AddNoteModalComponent,
		FooterComponent,
		ConfidentialiteComponent,
		MentionsLegalesComponent,
		LoreComponent,
		ProfilComponent,
		UserListComponent,
		PasswordForgottenComponent,
		ResetPasswordComponent,
		ArmeComponentComponent,
		ArmureComponentComponent,
		PotionComponentComponent,
		PoisonComponentComponent,
		UtilitaireComponentComponent,
		ContenantComponentComponent,
		BazarComponentComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatInputModule,
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		QuillModule.forRoot(), // Ajouter ce module
		ToastrModule.forRoot({
			positionClass: 'toast-top-center', // Changer cette ligne pour centrer les notifications
			timeOut: 3000, // Temps avant que la notification disparaisse (en ms)
			preventDuplicates: true, // Prévenir les notifications dupliquées
		}),
		MatIconModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		AuthGuard,
		AuthService,
		UserService,
		{ provide: LOCALE_ID, useValue: 'fr' },
		AdminGuard,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
