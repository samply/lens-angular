import { Blaze } from './blaze';

describe('Blaze', () => {
  it('should create an instance', () => {
    expect(new Blaze(
      "blaze",
      new URL("http://localhost:8080")
    )).toBeTruthy();
  });
});
