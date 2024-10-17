import { Hero } from '@/script/object/party/Hero';

export interface Item {
	text: string;
	onSelect: (hero: Hero) => void;
}
