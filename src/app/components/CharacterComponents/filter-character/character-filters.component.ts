import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterFilters } from '../../../types/CharacterFilters';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

type FilterState = 'collapsed' | 'fully-open';
type FilterSection = 'categories' | 'levels' | 'races' | 'campaigns' | 'age' | 'stats';

interface Campaign {
	id: string;
	name: string;
}

@Component({
    selector: 'app-character-filters',
    templateUrl: './character-filters.component.html',
    styleUrls: ['./character-filters.component.css'],
    imports: [
        NgClass,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class CharacterFiltersComponent {
	@Input() showAdminFilters = false;
	@Input() resultsCount: number | null = null;
	@Output() filtersChange = new EventEmitter<CharacterFilters>();
	@Output() searchChange = new EventEmitter<string>();

	filterState: FilterState = 'collapsed';
	searchText = '';
	openSections = new Set<FilterSection>();

	availableRaces = ['Humain', 'Elfe', 'Nain', 'Halfelin', 'Orque', 'Tieffelin', 'Dragonien', 'Gnome', 'Demi-Elfe', 'Demi-Orque', 'Autre'];

	availableCampaigns: Campaign[] = [
		{ id: 'camp1', name: 'Campagne 1' },
		{ id: 'camp2', name: 'Campagne 2' },
		{ id: 'camp3', name: 'Campagne 3' },
	];

	filters: CharacterFilters = {
		publishedOnly: true,
		upToDate: false,
		mjApproved: false,
		beginners: false,
		hasImage: false,
		levelRange: [1, 10],
		ageRange: [0, 1000],
		races: [],
		selectedCampaign: '',
		strengthRange: [30, 85],
		agilityRange: [30, 85],
		enduranceRange: [30, 85],
		socialRange: [30, 85],
		mentalRange: [30, 85],
	};

	private defaultFilters: CharacterFilters = { ...this.filters };

	// ========== GESTION DES ÉTATS ==========
	openFilters() {
		this.filterState = 'fully-open';
	}

	closeFilters() {
		this.filterState = 'collapsed';
		this.openSections.clear();
	}

	// ========== GESTION DES SECTIONS ==========
	toggleSection(section: FilterSection) {
		if (this.openSections.has(section)) {
			this.openSections.delete(section);
		} else {
			this.openSections.add(section);
		}
	}

	isSectionOpen(section: FilterSection): boolean {
		return this.openSections.has(section);
	}

	// ========== RECHERCHE ==========
	onSearchChange() {
		this.searchChange.emit(this.searchText);
	}

	clearSearch() {
		this.searchText = '';
		this.onSearchChange();
	}

	// ========== FILTRES ==========
	onFilterChange() {
		this.filtersChange.emit({ ...this.filters });
	}

	// ========== NIVEAUX ==========
	setExactLevel(level: number) {
		this.filters.levelRange = [level, level];
		this.onFilterChange();
	}

	// ========== ÂGE ==========
	setAgeRange(min: number, max: number) {
		this.filters.ageRange = [min, max];
		this.onFilterChange();
	}

	// ========== RACES ==========
	onRaceChange(event: Event, race: string) {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			if (!this.filters.races.includes(race)) {
				this.filters.races.push(race);
			}
		} else {
			this.filters.races = this.filters.races.filter((r) => r !== race);
		}
		this.onFilterChange();
	}

	selectAllRaces() {
		this.filters.races = [...this.availableRaces];
		this.onFilterChange();
	}

	clearRaces() {
		this.filters.races = [];
		this.onFilterChange();
	}

	// ========== STATS ==========
	resetStats() {
		this.filters.strengthRange = [30, 85];
		this.filters.agilityRange = [30, 85];
		this.filters.enduranceRange = [30, 85];
		this.filters.socialRange = [30, 85];
		this.filters.mentalRange = [30, 85];
		this.onFilterChange();
	}

	hasModifiedStats(): boolean {
		return (
			this.filters.strengthRange[0] !== 1 ||
			this.filters.strengthRange[1] !== 100 ||
			this.filters.agilityRange[0] !== 1 ||
			this.filters.agilityRange[1] !== 100 ||
			this.filters.enduranceRange[0] !== 1 ||
			this.filters.enduranceRange[1] !== 100 ||
			this.filters.socialRange[0] !== 1 ||
			this.filters.socialRange[1] !== 100 ||
			this.filters.mentalRange[0] !== 1 ||
			this.filters.mentalRange[1] !== 100
		);
	}

	// ========== RESET ==========
	resetAllFilters() {
		this.filters = { ...this.defaultFilters };
		this.searchText = '';
		this.onSearchChange();
		this.onFilterChange();
	}

	hasActiveFilters(): boolean {
		return (
			this.searchText.trim() !== '' ||
			this.filters.publishedOnly !== this.defaultFilters.publishedOnly ||
			this.filters.upToDate !== this.defaultFilters.upToDate ||
			this.filters.mjApproved !== this.defaultFilters.mjApproved ||
			this.filters.beginners !== this.defaultFilters.beginners ||
			this.filters.hasImage !== this.defaultFilters.hasImage ||
			this.filters.levelRange[0] !== this.defaultFilters.levelRange[0] ||
			this.filters.levelRange[1] !== this.defaultFilters.levelRange[1] ||
			this.filters.ageRange[0] !== this.defaultFilters.ageRange[0] ||
			this.filters.ageRange[1] !== this.defaultFilters.ageRange[1] ||
			this.filters.races.length > 0 ||
			this.filters.selectedCampaign !== this.defaultFilters.selectedCampaign ||
			this.hasModifiedStats()
		);
	}

	// Méthodes pour Niveaux
	onLevelMinChange() {
		if (this.filters.levelRange[0] > this.filters.levelRange[1]) {
			this.filters.levelRange[0] = this.filters.levelRange[1];
		}
		this.onFilterChange();
	}

	onLevelMaxChange() {
		if (this.filters.levelRange[1] < this.filters.levelRange[0]) {
			this.filters.levelRange[1] = this.filters.levelRange[0];
		}
		this.onFilterChange();
	}

	getLevelRangeLeft(): number {
		return ((this.filters.levelRange[0] - 1) / 9) * 100;
	}

	getLevelRangeWidth(): number {
		return ((this.filters.levelRange[1] - this.filters.levelRange[0]) / 9) * 100;
	}

	// Méthodes pour Âge
	onAgeMinChange() {
		if (this.filters.ageRange[0] > this.filters.ageRange[1]) {
			this.filters.ageRange[0] = this.filters.ageRange[1];
		}
		this.onFilterChange();
	}

	onAgeMaxChange() {
		if (this.filters.ageRange[1] < this.filters.ageRange[0]) {
			this.filters.ageRange[1] = this.filters.ageRange[0];
		}
		this.onFilterChange();
	}

	getAgeRangeLeft(): number {
		return (this.filters.ageRange[0] / 1000) * 100;
	}

	getAgeRangeWidth(): number {
		return ((this.filters.ageRange[1] - this.filters.ageRange[0]) / 1000) * 100;
	}

	// Méthodes pour Stats
	onStatMinChange(stat: 'strength' | 'agility' | 'endurance' | 'social' | 'mental') {
		const rangeKey = `${stat}Range` as keyof CharacterFilters;
		const range = this.filters[rangeKey] as [number, number];

		if (range[0] > range[1]) {
			range[0] = range[1];
		}
		this.onFilterChange();
	}

	onStatMaxChange(stat: 'strength' | 'agility' | 'endurance' | 'social' | 'mental') {
		const rangeKey = `${stat}Range` as keyof CharacterFilters;
		const range = this.filters[rangeKey] as [number, number];

		if (range[1] < range[0]) {
			range[1] = range[0];
		}
		this.onFilterChange();
	}

	getStatRangeLeft(stat: 'strength' | 'agility' | 'endurance' | 'social' | 'mental'): number {
		const rangeKey = `${stat}Range` as keyof CharacterFilters;
		const range = this.filters[rangeKey] as [number, number];
		return ((range[0] - 1) / 99) * 100;
	}

	getStatRangeWidth(stat: 'strength' | 'agility' | 'endurance' | 'social' | 'mental'): number {
		const rangeKey = `${stat}Range` as keyof CharacterFilters;
		const range = this.filters[rangeKey] as [number, number];
		return ((range[1] - range[0]) / 99) * 100;
	}
}
