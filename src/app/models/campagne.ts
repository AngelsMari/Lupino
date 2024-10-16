import { Character } from "./character";
import { User } from "./user";

export interface Campagne {
    _id: string;
    mj: User;
    personnagesJoueurs: Character[];
    pnjs: Character[];
    imageUrl: string;
    name: string;
    speech: string;
    etat: string;
    dateDebut: Date;
    dateFin: Date;
    access: string;
    notes: Note[];
}

export interface Note {
    auteur: User;
    texte: string;
    type: string;
}