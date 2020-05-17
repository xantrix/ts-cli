import { Gcd } from '../gcd.entity';
import { GcdService } from '../gcd.service';

describe('test Gdc service', () => {
  // beforeEach(() => {
  // });

  test('all items ok', async () => {
    const strategy = new Gcd(
      { lat: Number('52.493256'), long: Number('13.446082') },
      Number('100')
    );
    const gcd = new GcdService(
      'src/__tests__/data/ok.txt', strategy
    );
    let list = await gcd.findItems();
    list = gcd.sortItems(list);
      expect(list).toEqual([
        { 'id': 'a1730bbd-9bce-4d28-ae30-580e2ddd1be8', 'lat': 52.504749, 'long': 13.452053 },
        { 'id': 'd9e7100c-5054-4ac2-bd61-5c3825c33ed9', 'lat': 52.0111839, 'long': 13.402053 }
    ]);
    const notValidList = gcd.getNotValidItems();
    expect(notValidList).toEqual([]);
  });

});
