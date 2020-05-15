
export interface Item {
  id: string;
  lat: string;
  long: string;
}

export function isItem(arg: any): arg is Item {
  return arg && arg.id && arg.lat && arg.long
        && typeof arg.id === 'string' && (arg.id as string).length === 36
        && typeof arg.lat === 'number'
        && typeof arg.long === 'number';
}
