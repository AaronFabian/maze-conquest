import { TWEEN } from '@/global';
import { Player } from '@/script/object/entity/Player';
import { BaseState } from '@/script/state/BaseState';
import { Level } from '@/script/world/Level';

const _window = window as any;

export class GameState extends BaseState {
	level: Level;
	player: Player;

	constructor() {
		super();

		// 01 Generate world level
		this.level = new Level(this);

		// 02 Create player data
		this.player = new Player(this.level);

		// 03 Setup maze level
		this.level.setup();

		console.log(this.level.maze.data);
		console.log('%c -game state-', 'color: #30AEBF;');
	}

	override update() {
		this.level.update();
	}

	override render() {
		this.level.render();
	}

	override exit = () => TWEEN.removeAll();
}
