export interface Armure {
    _id: string;         // Identifiant unique
    nom: string;        // Nom de l'armure
    categorie: string;  // Catégorie (par exemple : légère, intermédiaire, lourde)
    description: string; // Description de l'armure
    statistiques: string; // Statistiques de l'armure
    prix: number;       // Prix de l'armure
  }