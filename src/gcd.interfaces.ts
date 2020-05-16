
export interface Strategy {
  checking(item: Item): boolean;
}

export interface Coordinate {
  lat: number;
  long: number;
}

export interface Item extends Coordinate {
  id: string;
}

export function isStrategy(arg: any): arg is Strategy {
  return arg && (arg as Strategy).checking !== undefined;
}

export function isItem(arg: any): arg is Item {
  return arg && arg.id && arg.lat && arg.long
        && typeof arg.id === 'string' && (arg.id as string).length === 36
        && typeof arg.lat === 'number'
        && typeof arg.long === 'number';
}

export function isCoordinate(arg: any): arg is Coordinate {
  return arg && arg.lat && arg.long
        && typeof arg.lat === 'number'
        && typeof arg.long === 'number';
}
