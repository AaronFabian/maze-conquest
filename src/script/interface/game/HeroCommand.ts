import { Hero } from '@/script/object/party/Hero';

// TODO: This is not HeroCommand should be HeroAction
export interface HeroCommand {
	text: string;
	onAction: (hero: Hero) => void;
}
