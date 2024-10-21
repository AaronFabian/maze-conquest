import { Hero } from '@/script/object/party/Hero';
import { BattleState } from '@/script/state/game/BattleState';
import { SelectionState } from '@/script/state/game/SelectionState';

export interface HeroCommand {
	text: string;
	onSelect: (hero: Hero, battleState: BattleState, selectionState: SelectionState) => void;
}
