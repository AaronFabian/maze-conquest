import { Hero } from '@/script/object/party/Hero';

export interface ItemObjectDef {
	name: string;
	description: string;
	effect: (caster: Hero, args?: any) => void;
}
