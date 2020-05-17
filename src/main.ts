import { Gcd } from './gcd.entity';
import { GcdService } from './gcd.service';
import util from 'util';
import { program } from 'commander';

export class Main {

  service!: GcdService;

  async init(args: string[], throwExceptions = false) {
    program
    .version('0.0.1')
    .description('CLI')
    .option('-d, --debug', 'output extra debugging')
    .option('-f, --file <filename>', 'Items filename', 'data/items.txt')
    .option('-r, --radius <km>', 'Radius expressed in km(s)', '100')
    .option('--lat <num>', 'Latitude float e.g. 37.429992', '52.493256')
    .option('--long <num>', 'Longitude float e.g. -122.140159', '13.446082');

    // program.parse(process.argv);
    program.parse(args);

    if (program.debug) {
      util.debuglog('app')('DEBUG!');
      console.log(program.opts());
    }

    if (program.file && program.radius && program.lat && program.long) {
      try {
        const strategy = new Gcd(
          { lat: Number(program.lat), long: Number(program.long) },
          Number(program.radius)
        );
        const gcd = new GcdService(
          program.file, strategy
        );
        this.service = gcd;

        await gcd.findItems();
        const list = gcd.getValidItems();
        gcd.displayItems(list);

        return list;

      } catch (e) {
        console.error('Error:', e.message);
        if (throwExceptions) {
          throw e;
        }
      }
    }

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  }
}
