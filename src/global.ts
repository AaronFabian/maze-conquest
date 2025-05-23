// style for webpack to apply css and minified the html css
import '@/style.css';

// this import will make our library globally available
import '@/lib/controller';
import '@/lib/howler.core.min.js';
import '@/lib/_tween.js';

import { UserDef } from '@/script/interface/system/UserDef';
import { StateStack } from '@/script/state/StateStack';
import { WorldType } from '@/script/world/World';
import { _QuadImage } from '@/utils';

const _window = window as any;

// lib (non npm dependencies)
// an animation library; make our game more attractive and executes animation in asynchronous way
export const TWEEN = _window.TWEEN;
export const Tween = _window.TWEEN.Tween;

// an audio library for implementing sound in our browser; with Howl make implementing sound in browser easier.
export const Howl = _window.Howl;

export const MODE = process.env.MODE;
export const SERVER_BASE_URL = MODE === 'prod' ? process.env.PUBLIC_SERVER_BASE_URL : process.env.LOCAL_URL;
export const SERVER_URL_WITH_PROTOCOL = MODE === 'prod' ? 'https://' + SERVER_BASE_URL : 'http://' + SERVER_BASE_URL;
export const WS_PROTOCOL = MODE === 'prod' ? 'wss' : 'ws';

export const TILE_SIZE = 16;

export const GUEST_DATA: UserDef = {
	items: {
		['phoenix-feather']: 10,
		['potion']: 10,
		['hi-potion']: 10,
	},
	allHeroes: {
		['soldier']: {
			level: 1,
			currentExp: 0,
			expToLevel: 10,
		},
		['wizard']: {
			level: 1,
			currentExp: 0,
			expToLevel: 10,
		},
	},
	party: ['soldier', 'wizard'],
	active: true,
	username: 'Guest User',
	createdAt: Date.now(),
	worlds: {
		[WorldType.Town]: 1,
		[WorldType.Level]: 1,
	},
};

// assets
export const gImages = new Map<string, HTMLImageElement>();

_window.gImages = gImages;

export const gFrames = new Map<string, Array<_QuadImage>>();

_window.gFrames = gFrames;

export const gSounds = new Map<string, any>();

_window.gSounds = gSounds;

export const gStateStack = new StateStack();

_window.gStateStack = gStateStack;

// for later game setup
export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 1280;
canvas.height = 720;
canvas.style.border = '1px solid white'; // ! delete dev purpose
// canvas.style.scale = '0.9'; // ! delete dev purpose

export const input = {
	mouse: {
		keysPressed: new Map<string, boolean>(),
		keysReleased: new Map<string, boolean>(),

		// x and y are coordinate based on canvas
		x: 0,
		y: 0,
	},
	keyboard: {
		keysPressed: <{ [key: string]: boolean }>{},
		isDown: <{ [key: string]: boolean }>{
			w: false,
			a: false,
			s: false,
			d: false,
		},
	},
};

export const firebaseConfig = {
	apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_BUCKET,
	appId: process.env.PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};
