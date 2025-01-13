import { User } from '@/script/system/model/User';
import { mixStatsService } from '@/script/system/service/mixStatsService';
import { validateBeforeSave } from '@/utils';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

async function saveFile(user: User) {
	const auth = getAuth();
	const db = getFirestore();
	const userUid = auth.currentUser!.uid;

	const allHeroes: { [key: string]: { [key: string]: number } } = {};
	for (const [k, hero] of user.getAllHeroes.entries()) {
		allHeroes[k] = { level: hero.level };
	}

	const items = Object.fromEntries(user.items);
	const worlds = Object.fromEntries(user.worlds);

	// Party appears to be an iterable, spreading is fine here
	const party = [...user.getParty];

	const data = {
		allHeroes,
		items,
		party,
		worlds,
	};

	const isValid = validateBeforeSave(data);
	if (!isValid) throw new Error('Fatal Error while saving user data ! Invalid / Malformed property');

	// 00 Update into database directly
	await updateDoc(doc(db, 'users', userUid), data);

	// 01 HTTP request: Update the mix_stats
	const error = await mixStatsService.updatePower(userUid);
	if (error !== null) alert(error.message);

	// 02 ...
}

export const userService = { saveFile };
