import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from "angular-oauth2-oidc";

import { LensAuthConfig, LENS_AUTH_CONFIG_TOKEN } from './lens-auth-config';

import { AuthenticationGuard } from './authentication.guard';

const authConfigMock = new LensAuthConfig(
  {
    type: "oauth2-code",
    identityProvider: new URL("http://some-identity-provider.com"),
    clientId: ""
  }
)

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [{
        provide: LENS_AUTH_CONFIG_TOKEN,
        useValue: authConfigMock
      },{
        provide: OAuthService
      },
      {
        provide: UrlHelperService
      },
      {
        provide: OAuthLogger
      },
      {
        provide: DateTimeProvider
      }]
    });
    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
