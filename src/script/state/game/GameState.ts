import { TWEEN } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Player } from '@/script/object/entity/Player';
import { BaseState } from '@/script/state/BaseState';
import { Level } from '@/script/world/Level';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';
import { StateMachine } from '@/script/state/StateMachine';
import { PlayerIdleState } from '@/script/state/entity/player/PlayerIdleState';

const _window = window as any;

export class GameState extends BaseState {
	level: Level;
	player: Player;

	constructor() {
		super();

		// 01 Generate world level
		this.level = new Level(this);

		// 02 Create player data
		const playerDef: EntityDef = ENTITY_DEFS.player;
		this.player = new Player(playerDef, this.level);

		// defining ship state
		const playerState = new Map<string, () => EntityBaseState>();
		playerState.set('idle', () => new PlayerIdleState(this.player));

		// use defined state and assign to the late init and immediately to 'idle' state
		// one thing should considered is state name and animation name could be different,
		// that means, changing state does not mean changing the animation !
		this.player.setStateMachine = new StateMachine(playerState);
		this.player.changeState('idle');

		// 03 Setup maze level
		this.level.setup();

		console.log(this.level.maze.data);
		console.log('%c -game state-', 'color: #30AEBF;');
	}

	override update() {
		this.player.update();
		this.level.update();
	}

	override render() {
		this.level.render();
		this.player.render();
	}

	override exit = () => TWEEN.removeAll();
}
