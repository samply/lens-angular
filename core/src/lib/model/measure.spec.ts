import { Measure, Stratifier } from './measure';

describe('Measure', () => {
  it('should create an instance', () => {
    expect(new Measure("", 0, [])).toBeTruthy();
  });
});

describe('Stratifier', () => {
  it('should create an instance', () => {
    expect(new Stratifier("", [])).toBeTruthy();
  });

  describe('isEmpty', () => {
    it('should return true with no stratum', () => {
      expect(new Stratifier("", []).isEmpty()).toBeTrue();
    })
    it('should be false if at least one stratum population is higher than 0', () => {
      expect(new Stratifier("", [
        {key: "some", population: 10}
      ]).isEmpty()).toBeFalse();
    })
  })

});
