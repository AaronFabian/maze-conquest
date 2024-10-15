import { EntityIdleState } from '@/script/state/entity/EntityIdleState';

export class HeroIdleState extends EntityIdleState {
	override enter(_params: any) {
		this.entity.setAnimation = 'idle-' + this.entity.direction;
	}
}
