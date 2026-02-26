export interface CharacterFilters {
	// Catégories
	publishedOnly: boolean;
	upToDate: boolean;
	mjApproved: boolean;
	beginners: boolean;
	hasImage: boolean;

	// Niveaux & Âge
	levelRange: [number, number];
	ageRange: [number, number];

	// Races
	races: string[];

	// Campagnes
	selectedCampaign: string;

	// Stats
	strengthRange: [number, number];
	agilityRange: [number, number];
	enduranceRange: [number, number];
	socialRange: [number, number];
	mentalRange: [number, number];
}
