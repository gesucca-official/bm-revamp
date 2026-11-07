import {Resources} from './character';

export interface Card {
  name: string;
  bindingName?: string;
  cost: Resources;
  effect: string;
  priority: number;
  canTarget: string[];
  basicAction: boolean;
  characterBound: boolean;
  boundToCharacter: string;
  // Regulation 1.12 R02: character a basic or last resort is reserved to (null = generic).
  exclusiveToCharacter?: string | null;
  lastResort: boolean;

  image: string;
  sprite: string;
}
