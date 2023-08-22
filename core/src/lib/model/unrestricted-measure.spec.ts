import { UnrestrictedMeasure } from './unrestricted-measure';

describe('UnrestrictedMeasure', () => {
  it('should create an instance', () => {
    expect(new UnrestrictedMeasure("a", ["b"])).toBeTruthy();
  });
});
