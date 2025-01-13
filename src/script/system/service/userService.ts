import { User } from '@/script/system/model/User';
import { mixStatsService } from '@/script/system/service/mixStatsService';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

async function saveFile(user: User) {
	const auth = getAuth();
	const db = getFirestore();
	const userUid = auth.currentUser!.uid;

	// 00 Update into database directly
	await updateDoc(doc(db, 'users', userUid), user.convertIntoDBObject());

	// 01 HTTP request: Update the mix_stats
	const error = await mixStatsService.updatePower(userUid);
	if (error !== null) alert(error.message);

	// 02 ...
}

export const userService = { saveFile };
