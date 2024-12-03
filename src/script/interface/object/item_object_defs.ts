import { ItemObjectDef } from '@/script/interface/object/ItemObjectDef';

export const GAME_OBJECT_DEFS: { [key: string]: ItemObjectDef } = {
	['phoenix-feather']: {
		name: 'Phoenix Feather',
		description:
			"Phoenix is a calamity creature that rule the space. Phoenix is symbol of safe. Just using it's feather will transport magically to safety place. In this case back to nearby Town",
		effect(caster, _) {
			console.log(`${caster.name} using phoenix wing to escape maze`);
		},
	},
	['potion']: {
		name: 'Potion',
		description: 'A regular Potion will restore 50 health points',
		effect(caster, _) {
			console.log(`${caster.name} using Potion!`);
			if (caster.currentHP + 50 > caster.HP) {
				const healedPoints = caster.currentHP + 50 - caster.HP;
				caster.currentHP = caster.HP;
				console.log(`${caster.name} HP healed by ${healedPoints} points!`);
			} else {
				caster.currentHP += 50;
				console.log(`${caster.name} HP healed by 50 points!`);
			}
		},
	},
};
