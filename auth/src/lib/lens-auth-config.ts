import {InjectionToken} from "@angular/core";

export type AuthTypes = "oauth2-code" | "oauth2-implicit";

export const LENS_AUTH_CONFIG_TOKEN = new InjectionToken('lens-auth-config');
export class LensAuthConfig {
  constructor(
    // clientSecret is optional and not recommended. Prefer implicit or authorization_code_with_pkce workflows.
    public authentication: {type: AuthTypes, identityProvider: URL, clientId: string, clientSecret?: string, strictDiscoveryDocumentValidation?: boolean},
    public authorization?: Array<{claim: string, value:string}>
  ) {
  }
}
