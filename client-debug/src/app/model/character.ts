import {Status} from './status';
import {Card} from './card';
import {Timer} from './timer';

export interface Character {
  name: string;
  bindingName: string;
  dead: boolean;
  itemsSize: number;
  immunities: string[];
  resources: Resources;
  statuses: Status[];
  timers: Timer[];
  items: Card[];

  sprite: string;
}

export interface Resources {
  [resource: string]: number;
}
