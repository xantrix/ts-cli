import { Exception } from './exception';

export class FileNotValid extends Exception {
  constructor(filename: string) {
    super('FileNotValid', `error ${filename}`);
  }
}
