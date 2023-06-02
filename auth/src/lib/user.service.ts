import {Inject, Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {BehaviorSubject} from "rxjs";
import {LENS_AUTH_CONFIG_TOKEN, LensAuthConfig} from "./lens-auth-config";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  private readonly authorizationRules: Array<{ claim: string; value: string }> = [];

  constructor(
    @Inject(LENS_AUTH_CONFIG_TOKEN) private authConfig: LensAuthConfig,
    private oauthService: OAuthService,
  ) {
    if (authConfig != undefined) {
      let authCodeFlowConfig = this.loadConfiguration(authConfig);
      this.oauthService.configure(authCodeFlowConfig);
      // Extract Authorization Rules
      if (authConfig.authorization != undefined) {
        this.authorizationRules = authConfig.authorization
      }
      // this sets up automatic refresh token usage
      this.oauthService.setupAutomaticSilentRefresh();
    }
  }

  /**
   * Handles the login process of the user.
   * @returns Promise<boolean>, that specifies whether the user is logged in.
   */
  login(): Promise<boolean> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidIdToken()) {
        this.oauthService.initLoginFlow();
        return false;
      } else {
        let authorized = this.isAuthorized();
        this.isAuthenticatedSubject$.next(authorized);
        return authorized;
      }
    }).catch(() => {
      console.error("Failed to load discovery document from identity provider.");
      return false
    })
  }

  /**
   * Redirects the user to identity providers logout point.
   */
  logout(): void {
    this.isAuthenticatedSubject$.next(false)
    this.oauthService.logOut();
  }

  /**
   * @returns true, then both access and id token are defined
   */
  isAuthenticated(): boolean {
    return this.oauthService.hasValidIdToken()
      && this.oauthService.hasValidAccessToken()
  }

  /**
   * Reads specified claim for current user from the identity provider
   * @param key, the key of the claim
   * @returns empty string for empty / undefined claims
   */
  getUserClaim(key: string): string {
    // HACK: unsure about how save it is to assume all json keys are strings?
    let claims: {[key:string]: any} = this.oauthService.getIdentityClaims();
    return (claims != undefined) ? claims[key].toString() : "";
  }

  /**
   * Check if user is authorized by any configured authorization rule.
   * @returns true, if one of the rules matches or no rule is configured
   */
  isAuthorized(): boolean {
    if (this.authorizationRules.length > 0) {
      let authorized = false;
      this.authorizationRules.forEach(rule => {
        let userClaim = this.getUserClaim(rule.claim)
        console.log(`This is ${rule.claim} for user: ${userClaim}`)
        if (userClaim === rule.value) {
          authorized = true
        }
      })
      return authorized;
    } else {
      return true;
    }
  }

  loadConfiguration(config: LensAuthConfig): AuthConfig {
    let loadedConfig: AuthConfig = {};
    loadedConfig = {
      issuer: (config.authentication.identityProvider.pathname == "/")
        ? config.authentication.identityProvider.origin
        : config.authentication.identityProvider.href,
      // should be general enough to don't need any configuration
      redirectUri: window.location.origin,
      clientId: config.authentication.clientId,
    }
    if (config.authentication.type == "oauth2-code") {
      loadedConfig.responseType = "code";
      loadedConfig.scope = "openid profile email offline_access api"
    } else if (config.authentication.type == "oauth2-implicit") {
      loadedConfig.scope = "openid profile email api"
    }
    if (config.authentication.clientSecret != undefined) {
      loadedConfig.dummyClientSecret = config.authentication.clientSecret;
    }
    if (config.authentication.strictDiscoveryDocumentValidation != undefined) {
      loadedConfig.strictDiscoveryDocumentValidation = config.authentication.strictDiscoveryDocumentValidation
    }
    return loadedConfig;
  }

}
