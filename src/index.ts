#!/usr/bin/env node
import { Main } from './main';

(async () => {
  try {
    // *** Entrypoint CLI ***
    const main = new Main();
    // process.argv === ['ts-node','src/index.ts','param','value', ...]
    // console.log('args', process.argv);
    await main.init(process.argv);
  } catch (e) {
    console.log(e);
  }
})();
