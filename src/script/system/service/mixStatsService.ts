import { SERVER_URL_WITH_PROTOCOL } from '@/global';
import { MixStats } from '@/script/system/model/MixStats';
import { MixStatsDef } from '@/script/interface/system/MixStatsDef';

async function updatePower(uid: string): Promise<Error | null> {
	try {
		const response = await fetch(`${SERVER_URL_WITH_PROTOCOL}/api/v1/mix_stats/${uid}/power`, { method: 'PATCH' });

		if (!response.ok) {
			const responseData = await response.json();

			switch (response.status) {
				case 400:
					return new Error(responseData.data.message);

				case 500:
					return new Error(responseData.data.message);

				default:
					console.error(response.status, '[System Error] Something wrong while fetching !');
					return new Error(`Something wrong while fetching ! (${response.status})`);
			}
		}

		return null;
	} catch (error) {
		if (error instanceof TypeError && error.message === 'Failed to fetch') {
			console.error('[Server Down] Unable to connect to the server. Please check your network or server status.');
			return new Error('Server is down or unreachable. Please try again later.');
		}

		console.error(error);
		return new Error('Unexpected Error while fetching. Please try again later');
	}
}

async function getLeaderboard(): Promise<{ error?: Error; value?: MixStats[] }> {
	try {
		const response = await fetch(`${SERVER_URL_WITH_PROTOCOL}/api/v1/mix_stats/leaderboard`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uidCursor: null }),
		});

		if (!response.ok) return { error: new Error(response.statusText) };

		const body = await response.json();
		const leaderboard = body.data.leaderboard as Array<MixStatsDef>;
		const mixStatsArr: MixStats[] = leaderboard.map(def => new MixStats(def));

		return { value: mixStatsArr };
	} catch (error) {
		return { error: error as Error };
	}
}

export const mixStatsService = { updatePower, getLeaderboard };
