import { Exception } from './exception';

export class ParamNotValid extends Exception {
  constructor(param: any, type: string) {
    switch (type) {
      case 'nan':
        super('ParamNotValid', `${param} should be a number`);
        break;
      case 'negative':
        super('ParamNotValid', `${param} should be a positive number`);
        break;
      default:
        super('ParamNotValid', `${param} is not valid`);
        break;
    }
  }
}
