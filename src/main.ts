#!/usr/bin/env node
import { GcdService } from './gcd.service';
import { program } from 'commander';

program
.version('0.0.1')
.description('CLI')
.option('-d, --debug', 'output extra debugging')
.option('-f, --file <filename>', 'Items filename', 'data/items.txt')
.option('-r, --radius <km>', 'Radius expressed in km(s)', '100')
.option('--lat <num>', 'Latitude float e.g. 37.427265', '52.493256')
.option('--long <num>', 'Longitude float e.g. -122.140159', '13.446082');

program.parse(process.argv);

if (program.debug) {
  console.log(program.opts());
}

if (program.file && program.radius && program.lat && program.long) {
  console.log(`${program.file}`);

  const gcd = new GcdService(
    program.file, program.radius, program.lat, program.long
  );

  (async () => {
    try {
      const res = await gcd.findItems();
      console.log(res);
    } catch (e) {
      console.log('Error caught');
    }
  })();

}

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
