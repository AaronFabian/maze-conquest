/**
 * Author: Aaron Fabian Saputra
 * Title: Maze Conquest
 * A single game where player will explore the maze, every level will
 * recorded and post online to see someone explored the highest maze game.
 */

// *** Application Entry Point ***
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { canvas, ctx, firebaseConfig, input, TWEEN } from '@/global';
import { GameState } from '@/script/state/game/GameState';
import { StartState } from '@/script/state/game/StartState';
import { TutorialState } from '@/script/state/game/TutorialState';
import { _LoadingAssetsScreen } from '@/script/system/screen/LoadingAssetScreen';
import { generateQuads, _newImage } from '@/utils';
import { SystemError } from '@/script/system/error/SystemError';
import { FatalErrorScreen } from '@/script/system/screen/FatalErrorScreen';

const _window = window as any;
let _msPrev: number = window.performance.now();
let _fps = 60;
let _fpsInterval = 1000 / _fps;

async function init() {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	getAuth(app);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	const loadingAssetScreen = new _LoadingAssetsScreen<HTMLImageElement>();
	loadingAssetScreen.push(_newImage('ui/background.png', 'start-screen-bg'));
	loadingAssetScreen.push(_newImage('ui/dialogue.png', 'dialogue'));
	loadingAssetScreen.push(_newImage('component/level1-tileset.png', 'level1-tileset'));
	loadingAssetScreen.push(_newImage('component/level1.png', 'level1'));
	loadingAssetScreen.push(_newImage('component/town-prototype.png', 'town-prototype'));
	loadingAssetScreen.push(_newImage('component/forest-prototype.png', 'forest-prototype'));
	loadingAssetScreen.push(_newImage('component/wrap-effect.png', 'wrap-effect'));
	loadingAssetScreen.push(_newImage('component/level1-battlefield.png', 'level1-battlefield'));
	loadingAssetScreen.push(_newImage('component/character/player.png', 'player'));
	loadingAssetScreen.push(_newImage('component/character/soldier.png', 'soldier'));
	loadingAssetScreen.push(_newImage('component/character/wizard.png', 'wizard'));
	loadingAssetScreen.push(_newImage('component/character/orc.png', 'orc'));
	loadingAssetScreen.push(_newImage('component/character/npcs.png', 'npcs'));
	loadingAssetScreen.push(_newImage('component/character/skeleton.png', 'skeleton'));
	loadingAssetScreen.push(_newImage('component/cursor.png', 'cursor'));
	loadingAssetScreen.push(_newImage('component/object/portal.png', 'portal'));
	loadingAssetScreen.push(_newImage('component/object/campfire.png', 'campfire'));
	loadingAssetScreen.push(_newImage('component/object/door.png', 'door'));

	await loadingAssetScreen.load(image => _window.gImages.set(image.alt, image));

	_window.gFrames.set('door', generateQuads(_window.gImages.get('door'), 16, 32));
	_window.gFrames.set('npcs', generateQuads(_window.gImages.get('npcs'), 32, 32));
	_window.gFrames.set('orc', generateQuads(_window.gImages.get('orc'), 100, 100));
	_window.gFrames.set('level1', generateQuads(_window.gImages.get('level1'), 80, 80));
	_window.gFrames.set('player', generateQuads(_window.gImages.get('player'), 32, 32));
	_window.gFrames.set('portal', generateQuads(_window.gImages.get('portal'), 32, 32));
	_window.gFrames.set('wizard', generateQuads(_window.gImages.get('wizard'), 100, 100));
	_window.gFrames.set('soldier', generateQuads(_window.gImages.get('soldier'), 100, 100));
	_window.gFrames.set('campfire', generateQuads(_window.gImages.get('campfire'), 16, 16));
	_window.gFrames.set('dialogue', generateQuads(_window.gImages.get('dialogue'), 16, 16));
	_window.gFrames.set('skeleton', generateQuads(_window.gImages.get('skeleton'), 100, 100));
	_window.gFrames.set('wrap-effect', generateQuads(_window.gImages.get('wrap-effect'), 32, 32));
	_window.gFrames.set('level1-tileset', generateQuads(_window.gImages.get('level1-tileset'), 16, 16));

	// _window.gStateStack.push(new TutorialState());
	// _window.gStateStack.push(new StartState());
	_window.gStateStack.push(new GameState());

	animation();
}

export function keyWasPressed(key: string): boolean {
	return input.keyboard.keysPressed.has(key);
}

function update() {
	TWEEN.update();

	_window.gStateStack.update();

	input.keyboard.keysPressed.clear();
}

window.addEventListener('keypress', ({ key }) => {
	input.keyboard.keysPressed.set(key, true);
});

window.addEventListener('keyup', ({ key }) => {
	input.keyboard.isDown[key] = false;
});

window.addEventListener('keydown', ({ key }) => {
	input.keyboard.isDown[key] = true;
});

function render() {
	ctx.reset();

	// create responsive game screen could be define here
	// ctx.scale(1, 1);
	// ctx.translate(canvas.width * 1, canvas.height * 1);
	_window.gStateStack.render();
}

function animation() {
	const animationId = requestAnimationFrame(animation);

	// treat all computer have the same execute speed
	const msNow: number = window.performance.now();
	const elapsed = msNow - _msPrev;
	if (elapsed < _fpsInterval) return;
	_msPrev = msNow - (elapsed % _fpsInterval);

	try {
		update();
		render();
	} catch (error) {
		switch (true) {
			case error instanceof SystemError:
				error.print();
				break;
			default:
				console.error('Fatal Error while animating', error);
				break;
		}

		document.title = 'Game crashed !';

		// will stop the game looping and freeze the screen so we know where crash happen
		cancelAnimationFrame(animationId);

		const ico = document.querySelector("link[rel~='icon']")! as HTMLLinkElement;
		ico.href = './assets/warning.ico';

		canvas.style.animation = 'shake 0.5s';

		// new FatalErrorScreen(error as Error);
	}
}

init();
