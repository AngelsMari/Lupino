import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noHtmlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const v = control.value as string;
	if (!v) return null;
	return /<.*?>/g.test(v) ? { htmlNotAllowed: true } : null;
};

/**
 * Validator basé sur les valeurs du form (PAS sur une variable de component)
 * computeRemainingPoints(values) doit être fourni.
 */
export const remainingPointsValidator = (computeRemaining: (v: any) => number): ValidatorFn => {
	return (group: AbstractControl): ValidationErrors | null => {
		if (!group || !('value' in group)) return null;
		const remaining = computeRemaining((group as any).value);
		return remaining === 0 ? null : { remainingPointsInvalid: true };
	};
};

export const lineageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const kind = control.get('kind')?.value as 'pure' | 'hybrid';
	const raceId = (control.get('raceId')?.value ?? '') as string;
	const parents = (control.get('parentRaceIds')?.value ?? []) as string[];
	const chosen = (control.get('chosenBonusIds')?.value ?? []) as string[];

	if (kind === 'pure') {
		if (!raceId) return { missingRaceId: true };
		return null;
	}

	// hybrid
	if (parents.length !== 2) return { needTwoParents: true };
	if (parents[0] === parents[1]) return { parentsMustDiffer: true };
	if (chosen.length !== 2) return { needTwoBonuses: true };
	if (chosen[0] === chosen[1]) return { bonusesMustDiffer: true };

	return null;
};
