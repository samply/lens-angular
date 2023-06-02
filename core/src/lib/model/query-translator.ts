import {InjectionToken} from '@angular/core';
import {Operation} from "./operation";

export const QUERY_TRANSLATOR_TOKEN = new InjectionToken('QueryTranslator');

export interface QueryTranslator {
  transform(query: Operation): string
}
