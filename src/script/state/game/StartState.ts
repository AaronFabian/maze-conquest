import { canvas, ctx, GUEST_DATA, TWEEN, Tween } from '@/global';
import { keyWasPressed } from '@/index';
import { UserDef } from '@/script/interface/system/UserDef';
import { BaseState } from '@/script/state/BaseState';
import { CurtainOpenState } from '@/script/state/game/CurtainOpenState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { GameState } from '@/script/state/game/GameState';
import { TutorialState } from '@/script/state/game/TutorialState';
import { User as _User } from '@/script/system/model/User';
import { sleep } from '@/utils';
import {
	createUserWithEmailAndPassword,
	deleteUser,
	getAuth,
	GoogleAuthProvider,
	OAuthCredential,
	signInWithPopup,
	signOut,
	updateProfile,
	User,
} from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

const _window = window as any;

enum LocalScreen {
	StartScreen,
	LoadGameScreen,
	NewGameScreen,
	AsyncOperation,
	NewGameWithSignInOrNotScreen,
	FreshStartConfirmationScreen,
	LogoutConfirmationScreen,
}

export class StartState extends BaseState {
	private blinkOpacity: number = 1;
	private localScreen: LocalScreen;
	private cursor: number;
	private user: User | null;
	userPhotoUrl: HTMLImageElement | null;

	constructor() {
		super();

		this.localScreen = LocalScreen.StartScreen;
		// this.localScreen = LocalScreen.LoadGameScreen;
		this.cursor = 1;
		this.user = null;
		this.userPhotoUrl = null;

		const tween1 = new Tween(this).to({ blinkOpacity: 0 }, 1000);
		const tween2 = new Tween(this).to({ blinkOpacity: 1 }, 1000);

		tween1.chain(tween2);
		tween2.chain(tween1);

		tween1.start();
	}

	private async checkUserSignedIn() {
		try {
			if (this.user !== null) {
				this.localScreen = LocalScreen.LoadGameScreen;
				return;
			}

			const auth = getAuth();
			await sleep(500);

			if (auth.currentUser === null) {
				this.localScreen = LocalScreen.NewGameScreen;
				return;
			}

			this.user = auth.currentUser;

			/*
				const db = getFirestore();
				const docRef = doc(db, 'users', this.user.uid);
				const docSnap = await getDoc(docRef);

				console.log(docSnap.data());
				onSnapshot(docRef, {
				next: (snp: DocumentSnapshot<DocumentData, DocumentData>) => {
						console.log(snp.data());
					},
				});
			*/
			const photoUrl = new Image();
			if (this.user.photoURL !== null) {
				photoUrl.src = this.user.photoURL;
				photoUrl.onload = () => (this.userPhotoUrl = photoUrl);
			}

			this.localScreen = LocalScreen.LoadGameScreen;
		} catch (error) {
			console.error(error);
		}
	}

	private async signIn() {
		try {
			const auth = getAuth();
			const userCred = await signInWithPopup(auth, new GoogleAuthProvider());

			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(userCred);
			if (credential === null) throw new Error('Credential not available');

			const token = credential!.accessToken;

			// The signed-in user info.
			const user = userCred.user;
			console.log(user);

			// IdP data available using getAdditionalUserInfo(result)
			// ...

			const db = getFirestore();
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			const userDef = { ...docSnap.data()! } as UserDef;
			const _user = new _User(userDef);

			_window.gStateStack.push(
				new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
					// pop it self
					// ...

					// pop StartState (this)
					_window.gStateStack.pop();

					_window.gStateStack.push(new GameState(_user));

					_window.gStateStack.push(new FadeOutState({ r: 155, g: 155, b: 155 }, 2000, () => {}));
				})
			);
		} catch (error: any) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			alert('Warning: popup closed by user');

			// The email of the user's account used.
			const email = error.customData.email;

			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...

			this.localScreen = LocalScreen.NewGameScreen;
		}
	}

	private async newUserSignIn() {
		try {
			const auth = getAuth();
			const userCred = await signInWithPopup(auth, new GoogleAuthProvider());

			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(userCred);
			if (credential === null) throw new Error('Credential not available');

			const token = credential!.accessToken;

			// The signed-in user info.
			const user = userCred.user;
			console.log('[System] User login success');
			console.log(user);
			console.log(token);

			// IdP data available using getAdditionalUserInfo(result)
			// ...

			// User may use old account and somehow create new account
			// We need to confirm User does he want to start fresh or continue the old save data
			// Fresh start User
			const db = getFirestore();
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				// this.userPhotoUrl
				this.user = user;
				this.cursor = 2; // Default for No options
				this.localScreen = LocalScreen.FreshStartConfirmationScreen;
				console.log('[System] Old saved data exist');
				return;
			}

			const usersRef = collection(db, 'users');
			const initData = window.structuredClone(GUEST_DATA);
			initData.username = user.displayName!;

			await setDoc(doc(usersRef, user.uid), initData);
			console.log('[System] Fresh user created');

			_window.gStateStack.push(
				new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
					// pop it self
					// ...

					// pop StartState (this)
					_window.gStateStack.pop();

					_window.gStateStack.push(new TutorialState());

					_window.gStateStack.push(new FadeOutState({ r: 155, g: 155, b: 155 }, 2000, () => {}));
				})
			);
		} catch (error: any) {
			console.error(error);
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error(errorCode, errorMessage);
			console.warn('[System] Popup closed by user, failed to register user');
			alert('Warning: Popup closed by user');

			// The email of the user's account used.
			// const email = error.customData.email;

			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...

			this.localScreen = LocalScreen.NewGameWithSignInOrNotScreen;
		}
	}

	private async userSignOut() {
		try {
			const auth = getAuth();
			await signOut(auth);

			this.user = null;
			this.localScreen = LocalScreen.StartScreen;
		} catch (error) {
			console.error(error);
			alert('Warning: Error while signing out user');
			this.localScreen = LocalScreen.StartScreen;
		}
	}

	private async handleFreshStart() {
		this.localScreen = LocalScreen.AsyncOperation;

		const db = getFirestore();

		// 01 Set the current data property active into false
		const updateDocRef = doc(db, 'users', this.user!.uid);
		await updateDoc(updateDocRef, { active: false });

		// 02 Delete from Authentication database at firebase
		const cacheUserEmail = this.user!.email!;
		const cacheUserPhotoURL = this.user!.photoURL!;
		const cacheUserDisplayName = this.user!.displayName!;
		await deleteUser(this.user!);
		this.user = null;

		// 03 Create new user with the same email and the same data
		const userCred = await createUserWithEmailAndPassword(getAuth(), cacheUserEmail, crypto.randomUUID());
		const user = userCred.user;
		await updateProfile(user, { displayName: cacheUserDisplayName, photoURL: cacheUserPhotoURL });

		// 04 Create new game save data
		const usersRef = collection(db, 'users');
		const initData = window.structuredClone(GUEST_DATA);
		initData.username = user.displayName!;
		await setDoc(doc(usersRef, user!.uid), initData);
		console.log('[System] User start fresh start');

		// 05
		_window.gStateStack.push(
			new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
				// pop it self
				// ...

				// pop StartState (this)
				_window.gStateStack.pop();

				_window.gStateStack.push(new TutorialState());

				_window.gStateStack.push(new FadeOutState({ r: 155, g: 155, b: 155 }, 2000, () => {}));
			})
		);
	}

	override update() {
		if (keyWasPressed('Enter')) {
			switch (this.localScreen) {
				case LocalScreen.StartScreen:
					this.localScreen = LocalScreen.AsyncOperation;
					this.cursor = 1;
					this.checkUserSignedIn();
					break;

				case LocalScreen.LoadGameScreen:
					if (this.cursor === 1) {
						this.localScreen = LocalScreen.AsyncOperation;
						this.handleLoadGame();
					}

					if (this.cursor === 2) {
						this.cursor = 1;
						this.localScreen = LocalScreen.LogoutConfirmationScreen;
					}

					if (this.cursor === 3) {
					}

					if (this.cursor === 4) {
						this.localScreen = LocalScreen.StartScreen;
					}
					break;

				case LocalScreen.NewGameScreen:
					if (this.cursor === 1) {
						this.localScreen = LocalScreen.NewGameWithSignInOrNotScreen;
					}

					if (this.cursor === 2) {
						// Basically user already played the game before but play at another device
						// or the token already expired
						this.localScreen = LocalScreen.AsyncOperation;
						this.signIn();
					}

					if (this.cursor === 3) {
					}

					if (this.cursor === 4) {
						this.localScreen = LocalScreen.StartScreen;
					}
					break;

				case LocalScreen.NewGameWithSignInOrNotScreen:
					if (this.cursor === 1) {
						// New game with Google
						this.localScreen = LocalScreen.AsyncOperation;
						this.newUserSignIn();
					}

					if (this.cursor === 2) {
						// New game without Google
						_window.gStateStack.push(
							new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
								// pop it self
								// ...

								// pop StartState (this)
								_window.gStateStack.pop();

								// TODO:
								// _window.gStateStack.push(new StoryOpeningState());

								_window.gStateStack.push(new GameState(new _User(GUEST_DATA)));

								_window.gStateStack.push(new FadeOutState({ r: 155, g: 155, b: 155 }, 2000, () => {}));
							})
						);
					}

					if (this.cursor === 3) {
						this.cursor = 1;
						this.localScreen = LocalScreen.NewGameScreen;
					}

					if (this.cursor === 4) {
						this.localScreen = LocalScreen.NewGameScreen;
					}
					break;

				case LocalScreen.LogoutConfirmationScreen:
					// Yes
					if (this.cursor === 1) {
						this.localScreen = LocalScreen.AsyncOperation;
						this.userSignOut();
					}

					// No
					if (this.cursor === 2) {
						this.cursor = 1;
						this.localScreen = LocalScreen.LoadGameScreen;
					}
					break;

				case LocalScreen.FreshStartConfirmationScreen:
					// Yes
					if (this.cursor === 1) {
						this.handleFreshStart();
					}

					// No
					if (this.cursor === 2) {
						this.localScreen = LocalScreen.StartScreen;
					}
					break;

				case LocalScreen.AsyncOperation:
					break;

				default:
					throw new Error('Unknown behavior from changing StartState local screen');
			}
		}

		// Here we defined dynamically how many options are there for each SCREEN
		let maxOptions = 3;
		if (this.localScreen === LocalScreen.NewGameScreen) {
			maxOptions = 4;
		}
		if (this.localScreen === LocalScreen.NewGameWithSignInOrNotScreen) {
			maxOptions = 3;
		}
		if (this.localScreen === LocalScreen.LoadGameScreen) {
			maxOptions = 4;
		}
		if (this.localScreen === LocalScreen.LogoutConfirmationScreen) {
			maxOptions = 2;
		}
		if (this.localScreen === LocalScreen.FreshStartConfirmationScreen) {
			maxOptions = 2;
		}

		// Cursor up
		if (keyWasPressed('w')) {
			this.cursor = this.cursor - 1 < 1 ? maxOptions : this.cursor - 1;
		}

		// Cursor down
		if (keyWasPressed('s')) {
			this.cursor = this.cursor + 1 > maxOptions ? 1 : this.cursor + 1;
		}
	}
	private async handleLoadGame() {
		try {
			const db = getFirestore();
			const userUid = getAuth().currentUser!.uid;
			const docRef = doc(db, 'users', userUid);
			const docSnap = await getDoc(docRef);

			// Load the user data and create the User instance
			const userDef = { ...docSnap.data() } as UserDef;
			const user = new _User(userDef);

			_window.gStateStack.push(
				new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
					// pop it self
					// ...

					// pop StartState (this)
					_window.gStateStack.pop();

					console.log();
					_window.gStateStack.push(new GameState(user));

					_window.gStateStack.push(new CurtainOpenState({ r: 155, g: 155, b: 155 }, 0, 2000, () => {}));
				})
			);
		} catch (error) {
			console.error(error);
			throw new Error('Unhandled error');
		}
	}

	override render() {
		ctx.drawImage(_window.gImages.get('start-screen-bg'), 0, 0);

		if (this.localScreen === LocalScreen.StartScreen) {
			ctx.font = '96px zig';
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.textAlign = 'center';
			ctx.fillText('Maze Conquest', canvas.width / 2, canvas.height / 2 - 104);

			ctx.font = '32px zig';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.blinkOpacity})`;
			ctx.textAlign = 'center';
			ctx.fillText('push enter button', canvas.width / 2, canvas.height / 2 + 32);
		}

		if (this.localScreen === LocalScreen.LoadGameScreen) {
			ctx.font = '96px zig';
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.textAlign = 'center';
			ctx.fillText('Maze Conquest', canvas.width / 2, canvas.height / 2 - 104);

			ctx.font = '32px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('Continue', canvas.width / 2, canvas.height / 2);

			ctx.fillStyle = `rgba(237, 67, 55, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('Logout', canvas.width / 2, canvas.height / 2 + 52);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 3 ? 1 : 0.4})`;
			ctx.fillText('BFS and DFS Simulation', canvas.width / 2, canvas.height / 2 + 104);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 4 ? 1 : 0.4})`;
			ctx.fillText('Back', canvas.width / 2, canvas.height / 2 + 156);

			this.renderUserInformation();
		}

		if (this.localScreen === LocalScreen.NewGameScreen) {
			ctx.font = '96px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.fillText('Maze Conquest', canvas.width / 2, canvas.height / 2 - 104);

			ctx.font = '32px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('New game', canvas.width / 2, canvas.height / 2);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('Load game', canvas.width / 2, canvas.height / 2 + 52);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 3 ? 1 : 0.4})`;
			ctx.fillText('BFS and DFS Simulation', canvas.width / 2, canvas.height / 2 + 104);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 4 ? 1 : 0.4})`;
			ctx.fillText('Back', canvas.width / 2, canvas.height / 2 + 156);
		}

		if (this.localScreen === LocalScreen.NewGameWithSignInOrNotScreen) {
			ctx.font = '36px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, 1)`;
			ctx.fillText('New game', canvas.width / 2, canvas.height / 2 - 36);

			ctx.font = '24px zig';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('register with google', canvas.width / 2, canvas.height / 2 + 18);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('play without sign in', canvas.width / 2, canvas.height / 2 + 52);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 3 ? 1 : 0.4})`;
			ctx.fillText('back', canvas.width / 2, canvas.height / 2 + 156);
		}

		if (this.localScreen === LocalScreen.FreshStartConfirmationScreen) {
			ctx.font = '36px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, 1)`;
			ctx.fillText('⚠️ Warning ⚠️', canvas.width / 2, canvas.height / 2 - 36);

			ctx.font = '20px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, 1)`;
			ctx.fillText('Old saved data found !!', canvas.width / 2, canvas.height / 2 + 8);
			ctx.fillText(
				'Start a new game will reset all the data and cannot be undone',
				canvas.width / 2,
				canvas.height / 2 + 38
			);

			ctx.font = '24px zig';
			ctx.fillStyle = `rgba(237, 67, 55, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('Yes, fresh start my account', canvas.width / 2, canvas.height / 2 + 102);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('No, cancel and continue last saved data', canvas.width / 2, canvas.height / 2 + 134);
		}

		if (this.localScreen === LocalScreen.LogoutConfirmationScreen) {
			ctx.font = '36px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, 1)`;
			ctx.fillText('Confirm logout', canvas.width / 2, canvas.height / 2 - 36);

			ctx.font = '24px zig';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('Logout', canvas.width / 2, canvas.height / 2 + 18);

			ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('Cancel', canvas.width / 2, canvas.height / 2 + 52);
		}

		if (this.localScreen === LocalScreen.AsyncOperation) {
			ctx.font = '32px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255, 255, 255, 1)`;
			ctx.fillText('Loading', canvas.width / 2, canvas.height / 2 - 16, canvas.width);

			ctx.font = '16px zig';
			ctx.fillStyle = `rgba(255, 255, 255, ${this.blinkOpacity})`;
			ctx.fillText('Connecting to server...', canvas.width / 2 + 16, canvas.height / 2 + 8, canvas.width);
		}

		// Copyright
		if (this.localScreen === LocalScreen.StartScreen) {
			ctx.font = '16px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.fillText('© International Paradigm', canvas.width / 2, canvas.height - 24);
		}
	}

	private renderUserInformation() {
		const userImg = this.userPhotoUrl;
		if (userImg !== null) {
			ctx.save();
			ctx.beginPath();

			ctx.arc(canvas.width / 2, canvas.height - userImg.height, 45, 0, Math.PI * 2);
			ctx.clip();

			ctx.drawImage(userImg, canvas.width / 2 - userImg.width / 2, canvas.height - userImg.height - userImg.height / 2);
			ctx.restore();
		}

		ctx.font = '16px zig';
		ctx.textAlign = 'center';
		ctx.fillStyle = `rgb(255, 255, 255)`;
		ctx.fillText('Welcome, ' + this.user!.displayName, canvas.width / 2, canvas.height - 24);
	}

	override exit = () => TWEEN.removeAll();
}
