import * as fs from 'fs';
import { once } from 'events';
import { createInterface }  from 'readline';
import { FileNotFound, FileNotValid, ParamNotValid, Exception } from './exceptions';
import { Item, isItem } from './gcd.interfaces';

export class GcdService  {

  private itemList: Item[] = [];
  private filename: string;
  private radius: number;
  private latitude: number;
  private longitude: number;

  constructor(filename: string, radius: number, lat: number, long: number) {
    this.filename = filename;
    this.radius = Number(radius);
    this.latitude = Number(lat);
    this.longitude = Number(long);

    switch (true) {
      case !fs.existsSync(this.filename):
        throw new FileNotFound(this.filename);
      case fs.statSync(this.filename).size === 0:
        throw new FileNotValid(this.filename);
      case !this.filename.endsWith('.txt'):
        throw new FileNotValid(this.filename);
      case Number.isNaN(this.latitude):
        throw new ParamNotValid('latitude', 'nan');
      case Number.isNaN(this.longitude):
        throw new ParamNotValid('longitude', 'nan');
      case Number.isNaN(this.radius):
        throw new ParamNotValid('radius', 'nan');
      case this.radius < 0:
        throw new ParamNotValid(`radius`, 'negative');
    }
  }

  public async findItems(): Promise<Item[] | Exception> {
    try {
      const rl = createInterface({
        input: fs.createReadStream(this.filename),
        crlfDelay: Infinity
      });
      rl.on('line', (line) => {

        try {
          const item = this.lineParse(line);
          if (isItem(item)) {
            this.itemList.push(item);
          }
        } catch (e) {
          throw new Exception('err', 'err');
        }
      });

      await once(rl, 'close');
      console.log('File processed.');

      return this.itemList;
    } catch (err) {
      console.error(err);
      throw new Exception('err', 'err');
    }
  }

  private lineParse(line: string) {
    const obj: any = { };
    const lineArray = line.split(',');

    for (const item of lineArray) {
      const kvp = item.split(':');

      if (kvp[1]) {
        const stringValue = kvp[1].trim();
        const isNumber = !Number.isNaN(Number(stringValue));
        obj[kvp[0].trim()] = isNumber ? Number(stringValue) : stringValue;
      }
    }

    return obj;
  }

}
