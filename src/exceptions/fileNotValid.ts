import { Exception } from './exception';

export class FileNotValid extends Exception {
  constructor(filename: string) {
    super('FileNotValid', `${filename} is not a valid file.`);
  }
}
