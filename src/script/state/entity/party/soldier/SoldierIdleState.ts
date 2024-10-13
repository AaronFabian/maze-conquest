import { EntityIdleState } from '@/script/state/entity/EntityIdleState';

export class SoldierIdleState extends EntityIdleState {
	enter(_params: any) {
		this.entity.setAnimation = 'idle-' + this.entity.direction;
	}
}
