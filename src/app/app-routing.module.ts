import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CharactersComponent } from './components/CharacacterComponents/characters/characters.component';
import { CharacterDetailComponent } from './components/CharacacterComponents/character-detail/character-detail.component';
import { LoginComponent } from './components/UserGestion/login/login.component';
import { RegisterComponent } from './components/UserGestion/register/register.component';
import { CreateCharacterComponent } from './components/CharacacterComponents/create-character/create-character.component';
import { RacesComponent } from './components/RaceComponents/races/races.component';
import { ItemsComponent } from './components/ItemComponents/items/items.component';
import { CreateCampagneComponent } from './components/CampagneComponents/create-campagne/create-campagne.component';
import { CampagneComponent } from './components/CampagneComponents/campagne/campagne.component';
import { CampagneDetailComponent } from './components/CampagneComponents/campagne-detail/campagne-detail.component';
import { MentionsLegalesComponent } from './components/pages/mentions-legales/mentions-legales.component';
import { ConfidentialiteComponent } from './components/pages/confidentialite/confidentialite.component';
import { LoreComponent } from './components/pages/lore/lore.component';
import { ProfilComponent } from './components/UserGestion/profil/profil.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'characters', component: CharactersComponent },
    { path: 'mycharacters', component: CharactersComponent },
    { path: 'character/:id', component: CharacterDetailComponent }, // Route pour la fiche de personnage
    { path: 'create-character', component: CreateCharacterComponent },
    { path: 'create-character/:id', component: CreateCharacterComponent },
    { path: 'races', component: RacesComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'create-campagne', component: CreateCampagneComponent },
    { path: 'campagnes/:id', component: CampagneComponent},
    { path: 'campagnes', component: CampagneComponent},
    { path: 'campagne/:id', component: CampagneDetailComponent},
    { path: 'mentions-legales', component: MentionsLegalesComponent },
    { path: 'politique-confidentialite', component: ConfidentialiteComponent },
    { path: 'lore', component: LoreComponent },
    { path: 'explorer', component: LoreComponent },
    { path: 'profil', component: ProfilComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
