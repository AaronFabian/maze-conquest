import { HeroStats } from '@/script/interface/system/HeroStats';

export interface UserDef {
	items: { [key: string]: number };
	allHeroes: { [key: string]: HeroStats };
	party: string[];
	active: boolean;
	username: string;
	createdAt: number;
	worlds: { [key: string]: number };
}
