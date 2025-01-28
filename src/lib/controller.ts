import { input, SERVER_BASE_URL } from '@/global';
import { getAuth, validatePassword } from 'firebase/auth';

function generateDpad() {
	// D Pad
	const dPad = document.querySelector<HTMLElement>('.d-pad')!;
	const yDPadInp = document.getElementById('dPadYInp')! as HTMLInputElement;
	const yDPadRange = document.getElementById('dPadY')! as HTMLInputElement;
	const xDpadInp = document.getElementById('dPadXInp')! as HTMLInputElement;
	const xDpadRange = document.getElementById('dPadX')! as HTMLInputElement;

	// Maintain separate values for X and Y positions
	let xDpadValue = 0;
	let yDpadValue = 0;

	// Function to update the transform style
	function updateDpadTransform() {
		dPad.style.transform = `translate(${xDpadValue}px, ${yDpadValue}px)`;
	}

	yDPadRange.addEventListener('input', () => {
		yDpadValue = parseInt(yDPadRange.value, 10);
		yDPadInp.value = yDPadRange.value;
		updateDpadTransform();
	});

	yDPadInp.addEventListener('change', () => {
		yDpadValue = parseInt(yDPadInp.value, 10);
		yDPadRange.value = yDPadInp.value;
		updateDpadTransform();
	});

	xDpadRange.addEventListener('input', () => {
		xDpadValue = parseInt(xDpadRange.value, 10);
		xDpadInp.value = xDpadRange.value;
		updateDpadTransform();
	});

	xDpadInp.addEventListener('change', () => {
		xDpadValue = parseInt(xDpadInp.value, 10);
		xDpadRange.value = xDpadInp.value;
		updateDpadTransform();
	});
}

function generateKeypad() {
	// Key Pad
	const keyPad = document.querySelector<HTMLElement>('.key')!;
	const keyPadYInp = document.getElementById('keyPadYInp')! as HTMLInputElement;
	const keyPadYRange = document.getElementById('keyPadY')! as HTMLInputElement;
	const keyPadXInp = document.getElementById('keyPadXInp')! as HTMLInputElement;
	const keyPadXRange = document.getElementById('keyPadX')! as HTMLInputElement;

	let keyPadXValue = 0;
	let keyPadYValue = 0;

	function updateKeyPadTransform() {
		keyPad.style.transform = `translate(${keyPadXValue}px, ${keyPadYValue}px)`;
	}

	keyPadYRange.addEventListener('input', () => {
		keyPadYValue = parseInt(keyPadYRange.value, 10);
		keyPadYInp.value = keyPadYRange.value;
		updateKeyPadTransform();
	});

	keyPadYInp.addEventListener('change', () => {
		keyPadYValue = parseInt(keyPadYInp.value, 10);
		keyPadYRange.value = keyPadYInp.value;
		updateKeyPadTransform();
	});

	keyPadXRange.addEventListener('input', () => {
		keyPadXValue = parseInt(keyPadXRange.value, 10);
		keyPadXInp.value = keyPadXRange.value;
		updateKeyPadTransform();
	});

	keyPadXInp.addEventListener('change', () => {
		keyPadXValue = parseInt(keyPadXInp.value, 10);
		keyPadXRange.value = keyPadXInp.value;
		updateKeyPadTransform();
	});
}

function generateMiscSettings() {
	// Misc settings
	const spController = document.querySelector<HTMLElement>('.sp-controller')!;
	const inpHideGui = document.getElementById('hideGUI')!;
	const setting = document.querySelector<HTMLElement>('.setting')!;

	inpHideGui.addEventListener('change', ev => {
		const checked = (inpHideGui as HTMLInputElement).checked;
		spController.style.display = checked ? 'none' : '';
	});

	const toggle = document.querySelector<HTMLButtonElement>('.toggle')!;
	toggle.addEventListener('click', ev => {
		setting.classList.toggle('off');
	});

	// Touchscreen controller
	const frame = 1000 / 60;
	const dPadBtn = document.querySelectorAll<HTMLButtonElement>('button[data-key]');
	let touchInterval: NodeJS.Timeout | null = null;

	function onTouchDown(key: string) {
		input.keyboard.isDown[key] = true;
	}
	function onTouchUp(key: string) {
		input.keyboard.isDown[key] = false;
	}
	dPadBtn.forEach(pad => {
		pad.addEventListener('mousedown', () => {
			input.keyboard.keysPressed[pad.dataset.key!] = true;

			// Clear existing interval to prevent duplicates
			if (touchInterval) clearInterval(touchInterval);

			touchInterval = setInterval(() => onTouchDown(pad.dataset.key!), frame);
		});

		pad.addEventListener('mouseup', () => {
			if (touchInterval) {
				clearInterval(touchInterval);
				touchInterval = null; // Reset the reference to ensure clean state
			}
			onTouchUp(pad.dataset.key!);
		});
	});
}

window.addEventListener('load', _ => {
	// 01
	generateDpad();

	// 02
	generateKeypad();

	// 03
	generateMiscSettings();

	// 04
	// Smartphone remote control
	let chatWs: WebSocket | null = null;
	let connecting = false;
	const roomNumberEl = document.getElementById('roomNumber')!;
	const connectWithSpBtn = document.getElementById('connectWithSp')! as HTMLInputElement;
	function connectChat(wsURL: string) {
		chatWs = new WebSocket(wsURL);

		chatWs.onopen = function (evt) {
			console.log('[System] websocket ok');
		};

		chatWs.onclose = function (evt) {
			console.log('[System] websocket has closed');

			// Reset
			chatWs = null; // Set WebSocket object to null to prevent reusing an old connection
			connecting = false; // Reset the connecting state
			connectWithSpBtn.checked = false; // Do not check the button after closing the WebSocket
			roomNumberEl.innerText = '-';
		};

		chatWs.onmessage = function (evt) {
			// console.log(evt);
			const messages = evt.data.split('\n');
			for (const message of messages) {
				const data = JSON.parse(message) as { [key: string]: string };
				const key = data.key;
				const command = data.command;
				switch (command) {
					case 'isDown':
						input.keyboard.isDown[key] = true;
						break;
					case 'pressed':
						input.keyboard.keysPressed[key] = true;
						break;
					case 'cancel':
						input.keyboard.isDown[key] = false;
						break;
					case 'idleStop':
						chatWs!.close(1000, 'User close connection');
						break;
					case 'checkForConnection':
						console.warn('Check connection ok!');
						break;

					default:
						console.error(evt);
						throw new Error('Unexpected command input');
				}
			}
		};

		chatWs.onerror = function (evt) {
			console.error('[System Error] ', evt);
		};
	}

	connectWithSpBtn.addEventListener('click', async _ => {
		// Prevent mash button from user
		if (connecting) {
			connectWithSpBtn.checked = true;
			return;
		}

		// Exit if already connected
		if (chatWs != null) return chatWs.close(1000, 'User close connection');

		// Generate randomUUID and take position 2 from UUID
		// That position 2 will be the token for connection into server
		// ex: '41ccb258-[ -> fa97 <- ]-4bfd-96e9-68113f281d4d'
		const roomID = crypto.randomUUID();
		const token = roomID.split('-')[1];

		// From firebase get the current user
		const auth = getAuth();
		const user = auth.currentUser;

		// User must logged in to use this feature
		if (user == null) {
			connecting = false;
			connectWithSpBtn.checked = false; // Do not check the button;
			alert('Please login to use this feature');
			return;
		}

		// Get user uid from firebase
		const uid = user.uid;

		// Handle invalid connection, sometimes the firebase return invalid
		// ex: /example-id it should be example-id
		if (uid.includes('/')) {
			connecting = false;
			connectWithSpBtn.checked = false;
			alert('Something wrong while connecting. Please try again.');
			return;
		}

		// Remove the empty space, such as: Google Map -> GoogleMap
		// const userName = user.displayName?.replace(/\s+/g, '');

		try {
			const response = await fetch(`${SERVER_BASE_URL}/api/v1/room/${uid}${token}`);
			const body = await response.json();
			if (!response.ok) {
				connecting = false;
				connectWithSpBtn.checked = false; // Do not check the button;
				alert(`Something wrong while connecting\nmessages: ${body.data.messages}`);
				return;
			}

			const wsURL = body['ChatWebsocketAddr'];
			connectChat(wsURL);

			roomNumberEl.innerText = token;
			alert(`Type this '${token}' token into your smartphone app\n* Do not share this token *`);
		} catch (error) {
			console.error(error);
		}
	});

	// Check connection button
	const checkSocketBtn = document.getElementById('checkSocketBtn') as HTMLButtonElement;
	checkSocketBtn.addEventListener('click', _ => {
		if (chatWs === null) return;

		chatWs.send('{"command": "checkForConnection"}');
	});
});
