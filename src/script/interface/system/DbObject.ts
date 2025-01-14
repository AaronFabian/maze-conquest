import { HeroStats } from '@/script/interface/system/HeroStats';

export interface DbObject {
	username?: string;
	active?: Boolean;
	createdAt?: Number;
	allHeroes: {
		[key: string]: HeroStats;
	};
	items: {
		[key: string]: Number;
	};
	party: Array<String>;
	worlds: {
		[key: string]: number;
	};
}
