import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

export class EntityRunState extends EntityBaseState {
	override enter(_params: any) {
		this.entity.setAnimation = 'run-' + this.entity.direction;
	}
}
