import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CharactersComponent } from './components/CharacterComponents/characters/characters.component';
import { CharacterDetailComponent } from './components/CharacterComponents/character-detail/character-detail.component';
import { LoginComponent } from './components/UserGestion/login/login.component';
import { RegisterComponent } from './components/UserGestion/register/register.component';
import { CreateCharacterComponent } from './components/CharacterComponents/create-character/create-character.component';
import { RacesComponent } from './components/RaceComponents/races/races.component';
import { ItemsComponent } from './components/ItemComponents/items/items.component';
import { CreateCampagneComponent } from './components/Campaigns/create-campagne/create-campagne.component';
import { CampagneComponent } from './components/Campaigns/campagne/campagne.component';
import { CampagneDetailComponent } from './components/Campaigns/campagne-detail/campagne-detail.component';
import { MentionsLegalesComponent } from './components/pages/mentions-legales/mentions-legales.component';
import { ConfidentialiteComponent } from './components/pages/confidentialite/confidentialite.component';
import { LoreComponent } from './components/pages/lore/lore.component';
import { ProfilComponent } from './components/UserGestion/profil/profil.component';
import { AuthGuard } from './services/auth/auth.guard';
import { AdminGuard } from './services/auth/admin.guard';
import { UserListComponent } from './components/UserGestion/list/user-list.component';
import { PasswordForgottenComponent } from './components/UserGestion/password-forgotten/password-forgotten.component';
import { ResetPasswordComponent } from './components/UserGestion/reset-password/reset-password.component';
import { NoAuthGuard } from './services/auth/noauth.guard';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] }, // Protéger cette route avec AuthGuard
	{ path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
	{ path: 'characters', component: CharactersComponent },
	{ path: 'mycharacters', component: CharactersComponent, canActivate: [AuthGuard] }, // Protéger cette route avec AuthGuard
	{ path: 'character/:id', component: CharacterDetailComponent }, // Route pour la fiche de personnage
	{ path: 'create-character', component: CreateCharacterComponent, canActivate: [AuthGuard] },
	{ path: 'create-character/:id', component: CreateCharacterComponent, canActivate: [AuthGuard] },
	{ path: 'races', component: RacesComponent },
	{ path: 'items', component: ItemsComponent },
	{ path: 'create-campagne', component: CreateCampagneComponent, canActivate: [AuthGuard] },
	{ path: 'mycampaigns', component: CampagneComponent, canActivate: [AuthGuard] },
	{ path: 'campagnes', component: CampagneComponent },
	{ path: 'campagne/:id', component: CampagneDetailComponent },
	{ path: 'mentions-legales', component: MentionsLegalesComponent },
	{ path: 'politique-confidentialite', component: ConfidentialiteComponent },
	{ path: 'lore', component: LoreComponent },
	{ path: 'explorer', component: LoreComponent },
	{ path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
	{ path: 'user-list', component: UserListComponent, canActivate: [AdminGuard] },
	{ path: 'forgot-password', component: PasswordForgottenComponent, canActivate: [NoAuthGuard] }, // Redirection pour la page de mot de passe oublié
	{ path: 'reset-password', component: ResetPasswordComponent, canActivate: [NoAuthGuard] }, // Redirection pour la page de réinitialisation du mot de passe
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
