import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterList',
	standalone: true,
})
export class FilterListPipe implements PipeTransform {
	transform<T>(items: T[] | null, searchText: string, predicate: (item: T, search: string) => boolean): T[] {
		if (!items) return [];
		if (!searchText) return items;
		const search = searchText.toLowerCase();
		return items.filter((item) => predicate(item, search));
	}
}
