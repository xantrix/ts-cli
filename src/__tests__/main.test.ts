import { Strategy } from './../gcd.interfaces';
import { ParamNotValid, FileNotFound, FileNotValid } from './../exceptions';
import { Main } from '../main';
import { GcdService } from '../gcd.service';

describe('test cli gcd', () => {
  const cliArgs = ['ts-node', 'src/index.ts'];
  const defaultArgs = ['-d', '-r', '100', '--lat', '52.493256', '--long', '13.446082'];

  // beforeEach(() => {
  // });

  test('it fails passing not a valid strategy', async () => {
    // @ts-ignore
    const strategy = { not_checking: () => { return false; } } as Strategy;
    expect.assertions(1);
    try {
      const g = new GcdService(
        'src/__tests__/data/ok.txt', strategy
      );
    } catch (error) {
      expect(error).toBeInstanceOf(ParamNotValid);
    }
  });

  test('it shows help if no enough params', async () => {
    const main = new Main();
    const args = [...cliArgs];
    expect.assertions(1);
    await expect(main.init(args, true)).resolves.toEqual(
      false
    );
  });

  test('it shows help if missing required params', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-d']];
    expect.assertions(1);
    await expect(main.init(args, true)).resolves.toEqual(
      false
    );
  });

  test('it fails when param file not exists', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'notexists.txt']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new FileNotFound('notexists.txt')
    );
  });

  test('it fails when param file is empty', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/empty.txt']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new FileNotValid('src/__tests__/data/empty.txt')
    );
  });

  test('it fails when param file is not txt', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/file.info']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new FileNotValid('src/__tests__/data/file.info')
    );
  });

  test('it fails when param radius is not a number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-r', 'text']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid('radius', 'nan')
    );
  });

  test('it fails when param radius is a negative number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-r', '-100']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid(`radius`, 'negative')
    );
  });

  test('it fails when param lat is not a number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['--lat', 'text']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid('targetCoord')
    );
  });

  test('it fails when param long is not a number', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['--long', 'text']];
    expect.assertions(1);
    await expect(main.init(args, true)).rejects.toEqual(
      new ParamNotValid('targetCoord')
    );
  });

  test('it reports when items are valid and in radius range', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/ok.txt'], ...defaultArgs];
    await main.init(args, true);
    const validList = main.service.getValidItems();

    // expect result is alphabetically ordered
    expect(validList).toEqual([
      { 'id': 'a1730bbd-9bce-4d28-ae30-580e2ddd1be8', 'lat': 52.504749, 'long': 13.452053 },
      { 'id': 'd9e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 52.0111839, 'long': 13.402053 }
    ]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([]);
  });

  test('it reports no result when items are valid but out of radius range', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/out-of-radius.txt'], ...defaultArgs];
    await main.init(args, true);
    const validList = main.service.getValidItems();

    expect(validList).toEqual([]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([]);
  });

  test('it returns when items are missing', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/missing.txt'], ...defaultArgs];
    await main.init(args, true);
    const validList = main.service.getValidItems();

    expect(validList).toEqual([
    ]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([
      { 'noid': 'z7ee6861', 'lat': 55.08068312, 'long': 12.86196247 },
      { 'id': 'b9e8100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 55.08068312 },
      { 'id': 'b8e7100c-5054-4ac2-bd61-5c3825c33ed9', long: 'longstring'},
      { 'long': 'longstring' }
    ]);
  });

  test('it returns when items are malformed', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/malformed.txt'], ...defaultArgs];
    await main.init(args, true);
    const validList = main.service.getValidItems();

    expect(validList).toEqual([
    ]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([
      { 'id': 'zshort', 'lat': 55.08068312, 'long': 12.86196247 },
      { 'id': 100, 'lat': 55.08068312, 'long': 12.86196247 },
      { 'id': 'b8e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 55.08068312, 'long': 'longstring' },
      { 'id': 'b9e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 'latstring', 'long': 10.5824478 }
    ]);
  });
});
