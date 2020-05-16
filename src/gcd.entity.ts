import { Strategy, Coordinate, Item, isCoordinate } from './gcd.interfaces';
import { ParamNotValid } from './exceptions';

export class Gcd implements Strategy{
  targetCoord: Coordinate;
  radius: number;

  constructor(targetCoord: Coordinate, radius: number) {
    this.targetCoord = targetCoord;
    this.radius = Number(radius);

    switch (true) {
      case !isCoordinate(this.targetCoord):
        throw new ParamNotValid('targetCoord');
      case Number.isNaN(this.radius):
        throw new ParamNotValid('radius', 'nan');
      case this.radius < 0:
        throw new ParamNotValid(`radius`, 'negative');
    }
  }

  /**
   * Checking if item meets strategy conditions
   * @param item
   */
  public checking(item: Item): boolean {
    const c1: Coordinate = this.convertToRadians(item);
    const c2: Coordinate = this.convertToRadians(this.targetCoord);
    const distance = this.calculateDistance(c1, c2);
    if (distance <= this.radius) {
      return true;
    }

    return false;
  }

  /**
   * Convert a coordinate from degree to radians
   * @param c
   */
  private convertToRadians(c: Coordinate): Coordinate {
    const pi = Math.PI;

    return {
        lat: Number.parseFloat((c.lat * (pi / 180)).toFixed(4)),
        long: Number.parseFloat((c.long * (pi / 180)).toFixed(4))
    } as Coordinate;
  }

  /**
   * Calculate with GCD formula the distance between 2 coords
   * @param c1
   * @param c2
   */
  private calculateDistance(c1: Coordinate, c2: Coordinate): number {
    const r = 6371; // radius of the earth as 6371

    /**
     * apply the Great Circle Distance formula
     * d = R * acos( sin φ1 * sin φ2 + cos φ1 * cos φ2 * cos Δλ )
     */
    const distance = r * Math.acos(
        Math.sin(c1.lat) * Math.sin(c2.lat) +
        Math.cos(c1.lat) * Math.cos(c2.lat) *
        Math.cos(Math.abs(c1.long - c2.long))
        );

    return distance;
  }
}
