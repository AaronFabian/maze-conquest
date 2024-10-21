import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

export class HeroAttackState extends EntityBaseState {
	override enter(_: any) {
		this.entity.setAnimation = 'attack-' + this.entity.direction + '-1';
	}
}
