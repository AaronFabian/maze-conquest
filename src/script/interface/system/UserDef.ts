export interface UserDef {
	items: { [key: string]: number };
	allHeroes: { [key: string]: { [key: string]: number } };
	party: string[];
	active: boolean;
	username: string;
	createdAt: number;
	worlds: { [key: string]: number };
}
