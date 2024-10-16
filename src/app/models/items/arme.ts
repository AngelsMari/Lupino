export interface Arme {
    _id: string;         // Identifiant unique
    rarete: string;     // Rareté de l'arme (par exemple : commune, rare, légendaire)
    nom: string;        // Nom de l'arme
    type: string;       // Type de l'arme (exemple : une main, deux mains, etc.)
    categorie: string;  // Catégorie (corps à corps, distance, siège, etc.)
    maniement: string;  // Maniement de l'arme (exemple : agi/force, précision, etc.)
    effet?: string;     // Effet spécifique de l'arme (si applicable)
    degats: string;     // Dégâts infligés
    portee?: string;     // Portée de l'arme (distance)
    munitions?: string; // Type de munitions (si applicable)
    prix: number;       // Prix de l'arme
    prixMunitions?: number; // Prix des munitions (si applicable)
  }