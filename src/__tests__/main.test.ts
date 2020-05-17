import { Main } from '../main';

describe('test Gdc service', () => {
  const cliArgs = ['ts-node', 'src/index.ts'];
  const defaultArgs = ['-r', '100', '--lat', '52.493256', '--long', '13.446082'];
  // beforeEach(() => {
  // });

  test('param radius invalid', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-r', 'text']];
    try {
      await main.init(args);
    } catch (e) {
      expect(e).toMatch(/radius should be a number/);
    }
  });

  test('all items ok', async () => {
    const main = new Main();
    const args = [...cliArgs, ...['-f', 'src/__tests__/data/ok.txt'], ...defaultArgs];
    await main.init(args);
    const validList = main.service.getValidItems();

    expect(validList).toEqual([
      { 'id': 'a1730bbd-9bce-4d28-ae30-580e2ddd1be8', 'lat': 52.504749, 'long': 13.452053 },
      { 'id': 'd9e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 52.0111839, 'long': 13.402053 }
    ]);
    const notValidList = main.service.getNotValidItems();
    expect(notValidList).toEqual([]);
  });

});
