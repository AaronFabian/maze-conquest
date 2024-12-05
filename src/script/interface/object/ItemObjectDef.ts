import { Hero } from '@/script/object/party/Hero';

export enum ItemType {
	BattleItem = 'battle-item',
	Miracle = 'miracle',
}

export interface ItemObjectDef {
	id: number;
	key: string;
	name: string;
	description: string;
	type: string;
	effect: (args: any, caster?: Hero) => boolean;
}
