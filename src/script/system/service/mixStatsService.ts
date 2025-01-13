import { SERVER_BASE_URL } from '@/global';

async function updatePower(uid: string): Promise<Error | null> {
	try {
		const response = await fetch(`${SERVER_BASE_URL}/api/v1/mix_stats/${uid}/power`, { method: 'PATCH' });

		if (!response.ok) {
			const responseData = await response.json();

			switch (response.status) {
				case 400:
					return new Error(responseData.data.message);

				case 500:
					return new Error(responseData.data.message);

				default:
					console.error('[System Error] Something wrong while fetching !');
					return new Error('Something wrong while fetching !');
			}
		}

		return null;
	} catch (error) {
		console.error(error);
		return new Error('Unexpected Error while fetching .updatePower');
	}
}

export const mixStatsService = { updatePower };
