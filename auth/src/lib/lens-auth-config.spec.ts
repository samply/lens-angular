import { LensAuthConfig } from './lens-auth-config';

describe('LensAuthConfig', () => {
  it('should create an instance', () => {
    expect(new LensAuthConfig(
      {
        type: "oauth2-code",
        identityProvider: new URL("http://some-identity-provider.com"),
        clientId: ""
      }
    )).toBeTruthy();
  });
});
