import { ParamNotValid, FileNotFound } from './../exceptions';
import { Main } from '../main';

describe('test Gdc service', () => {
  const cliArgs = ['ts-node', 'src/index.ts'];
  const defaultArgs = ['-r', '100', '--lat', '52.493256', '--long', '13.446082'];

  // beforeEach(() => {
  // });

  test('it fail when param file not exists', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'notexists.txt']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new FileNotFound('notexists.txt')
    );
  });

  test('it fail when param radius is not a number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-r', 'text']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid('radius', 'nan')
    );
  });

  test('it fail when param lat is not a number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['--lat', 'text']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid('targetCoord')
    );
  });

  test('all items are valid', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/ok.txt'], ...defaultArgs];
    await main.init(args, true);
    const validList = main.service.getValidItems();

    expect(validList).toEqual([
      { 'id': 'a1730bbd-9bce-4d28-ae30-580e2ddd1be8', 'lat': 52.504749, 'long': 13.452053 },
      { 'id': 'd9e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 52.0111839, 'long': 13.402053 }
    ]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([]);
  });

});
