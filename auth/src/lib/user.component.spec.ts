import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from "angular-oauth2-oidc";
import { SplitButtonModule } from 'primeng/splitbutton';

import { LensAuthConfig, LENS_AUTH_CONFIG_TOKEN } from './lens-auth-config';

import { UserComponent } from './user.component';

const authConfigMock = new LensAuthConfig(
  {
    type: "oauth2-code",
    identityProvider: new URL("http://some-identity-provider.com"),
    clientId: ""
  }
)

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SplitButtonModule
      ],
      declarations: [
        UserComponent,
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
