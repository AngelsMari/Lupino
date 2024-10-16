export interface Potion {
    _id: string;         // Identifiant unique
    nom: string;        // Nom de la potion
    type: string;       // Type de la potion (exemple : soin, poison, mana)
    effet: string;      // Effet de la potion
    prix: number;       // Prix de la potion
}