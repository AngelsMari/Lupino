import { Component } from '@angular/core';
import { RaceService } from '../../../services/LupinoApi/race.service';
import { UserService } from '../../../services/LupinoApi/user.service';
import { Race } from '../../../models/race';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RaceCreateComponent } from '../../modal/race-create/race-create.component';
import { map, Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { shareReplay, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-races',
	templateUrl: './races.component.html',
	styleUrl: './races.component.css',
	imports: [NgClass, AsyncPipe],
})
export class RacesComponent {
	isAdmin$!: Observable<boolean>;
	userId: string | null = sessionStorage.getItem('user_id');

	race$!: Observable<Race[]>;
	commonRaces$!: Observable<Race[]>;
	exoticRaces$!: Observable<Race[]>;

	isExoticVisible: boolean = false;

	constructor(
		private modalService: NgbModal,
		private raceService: RaceService,
		private userService: UserService,
	) {}

	ngOnInit(): void {
		this.loadRaces();
		this.checkIfAdmin();
	}

	loadRaces() {
		this.race$ = this.raceService.getRaces();
		this.commonRaces$ = this.race$.pipe(map((races) => races.filter((race) => race.type === 'commune')));
		this.exoticRaces$ = this.race$.pipe(map((races) => races.filter((race) => race.type === 'inhabituelle')));
	}

	toggleExoticVisibility() {
		this.isExoticVisible = !this.isExoticVisible;
	}

	private checkIfAdmin(): void {
		this.isAdmin$ = this.userService.getUserData().pipe(
			map((user) => user?.isAdmin ?? false),
			startWith(false),
			shareReplay(1),
		);
	}

	openCreateRaceModal(): void {
		const modalRef = this.modalService.open(RaceCreateComponent);
		modalRef.result.then(
			(result) => {
				if (result === 'created') {
					this.loadRaces(); // Recharger les races après création
				}
			},
			(reason) => {
				console.log('Modale fermée: ', reason);
			},
		);
	}

	openEditRaceModal(race: any) {
		const modalRef = this.modalService.open(RaceCreateComponent, { centered: true });
		modalRef.componentInstance.race = race; // 👈 on passe la race
		modalRef.closed.subscribe(() => this.loadRaces());
	}
}
