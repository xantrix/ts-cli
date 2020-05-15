import { Exception } from './exception';

export class FileNotFound extends Exception {
  constructor(filename: string) {
    super('FileNotFound', `error ${filename}`);
  }
}
