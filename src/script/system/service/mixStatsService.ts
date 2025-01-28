import { SERVER_URL_WITH_PROTOCOL } from '@/global';

async function updatePower(uid: string): Promise<Error | null> {
	try {
		console.log(`${SERVER_URL_WITH_PROTOCOL}/api/v1/mix_stats/${uid}/power`);
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

export const mixStatsService = { updatePower };
