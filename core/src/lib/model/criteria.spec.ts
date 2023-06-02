import { Criteria } from './criteria';

describe('Criteria', () => {
  it('should create an instance', () => {
    expect(new Criteria(
      "",
      {de: "", en: ""},
      "string",
      "",
      []
    )).toBeTruthy();
  });
});
