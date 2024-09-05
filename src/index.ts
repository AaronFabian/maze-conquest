import { canvas, ctx, input, TWEEN } from './global';
import { StartState } from './script/states/games/StartState';
import { LoadingAssetScreen } from './script/world/LoadingAssetScreen';
import { generateQuads } from './utils';

const _window = window as any;
let _msPrev: number = window.performance.now();
let _fps = 60;
let _fpsInterval = 1000 / _fps;

async function init() {
	// declare local screen only for displaying loading screen
	// in general "screen" still inherit from BaseState but they not relate to game update nor render
	const imageToAwait: Array<Promise<HTMLImageElement>> = [];
	const loadingScreen = new LoadingAssetScreen(imageToAwait);
	// imageToAwait.push(__newImage(`ui/health.png`, 'health-panel', loadingScreen));

	const resolvedImages = await Promise.all(imageToAwait);
	resolvedImages.forEach(image => _window.gImages.set(image.alt, image));

	// _window.gFrames.set('asteroid', generateQuads(_window.gImages.get('asteroid'), 96, 96));

	_window.gStateStack.push(new StartState());
	// _window.gStateStack.push(new GameState());

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
	// ctx.scale(0.5, 0.5);
	// ctx.translate(canvas.width * 0.5 - 0, canvas.height * 0.5);
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
		console.error('Fatal Error while animating', error);
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
