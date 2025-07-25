import { UserPublicData } from './userpublicdata';

// character.model.ts
export interface Character {
	_id: string;
	owner: UserPublicData;
	imageUrl: string;
	isPNJ: boolean;
	name: string;
	age: string; // Ajout du champ pour l'âge
	level: number;
	race: string;
	skincolor: string; // Ajout du champ pour la couleur de peau
	height: string; // Ajout du champ pour la taille
	weight: string; // Ajout du champ pour le poids
	sexe: string; // Ajout du champ pour le genre
	eyes: string; // Ajout du champ pour les yeux
	hair: string; // Ajout du champ pour les cheveux
	current_hp: number;
	max_hp: number;
	current_mana: number;
	max_mana: number;
	strength: number;
	agility: number;
	endurance: number;
	social: number;
	mental: number;
	positive_trait: string;
	negative_trait: string;
	skills: Skill[];
	inventory: string;
	backstory: string;
	gold: number;
	masteries: string[];
	languages: string[];
	isPublic: boolean;
}

export interface Skill {
	name: string;
	description: string;
	effects: string;
	cost: string;
}
