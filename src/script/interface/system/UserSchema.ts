import { Hero } from '@/script/object/party/Hero';

export interface UserSchema {
	createdAt: Date;
	username: string;
	active: boolean;
	items: Map<string, number>;

	_uid: string;
	allHeroes: Map<string, Hero>;
	party: string[];
}
