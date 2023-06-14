import { Beam } from './beam';

describe('Beam', () => {
  it('should create an instance', () => {
    expect(new Beam(
      "beam",
      new URL("http://localhost:8080"),
      ["first site"]
    )).toBeTruthy();
  });

  it('should create an instance with withCredentials false', () => {
    expect(new Beam(
      "beam",
      new URL("http://localhost:8080"),
      ["first site"],
      false
    )).toBeTruthy();
  });

});
