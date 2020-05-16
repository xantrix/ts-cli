import * as fs from 'fs';
import { once } from 'events';
import { createInterface }  from 'readline';
import { FileNotFound, FileNotValid, ParamNotValid } from './exceptions';
import { Item, isItem, Strategy, isStrategy } from './gcd.interfaces';

export class GcdService {

  private itemList: Item[] = [];
  private filename: string;
  private strategy: Strategy;

  constructor(filename: string, strategy: Strategy) {
    this.filename = filename;
    this.strategy = strategy;

    switch (true) {
      case !fs.existsSync(this.filename):
        throw new FileNotFound(this.filename);
      case fs.statSync(this.filename).size === 0:
        throw new FileNotValid(this.filename);
      case !this.filename.endsWith('.txt'):
        throw new FileNotValid(this.filename);
      case !isStrategy(this.strategy):
        throw new ParamNotValid(`strategy`);
    }
  }

  /**
   * Find valid items
   */
  public async findItems() {
    try {
      const rl = createInterface({
        input: fs.createReadStream(this.filename),
        crlfDelay: Infinity
      });
      console.log('File opened');
      rl.on('line', (line) => {
        const item = this.lineParse(line);
        if (isItem(item)) {
          if (this.strategy.checking(item)) {
            // console.log(`Item found:`, item);
            this.itemList.push(item);
          }
        } else {
          console.warn(`Item not valid found:`, item);
        }
      });

      await once(rl, 'close');
      console.log('File processed.');

      return this.itemList;
    } catch (e) {
      console.error('Error in findItems:', e);
      throw e;
    }
  }

  /**
   * Sort list of item
   * @param list
   */
  public sortItems(list: Item[]): Item[] {
    return list.sort((i1: Item, i2: Item) => {
      if (i1.id < i2.id) {
        return -1;
      }
      else if (i1.id === i2.id) {
        return 0;
      }

      return 1;
    });
  }

  /**
   * Print valid items info
   */
  public displayItems(list: Item[]): void {
    list.forEach((item) => {
      console.log(`item id: ${item.id}`);
    });
    console.log(`Items found: ${list.length}`);
  }

  /**
   * Convert string record to object
   * @param line
   */
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
