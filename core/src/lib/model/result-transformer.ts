import {InjectionToken} from '@angular/core';
import {Measure} from "./measure";
import { AbstractMeasure } from './abstract-measure';

export const RESULT_TRANSFORMER_TOKEN = new InjectionToken('ResultTransformer')

export interface ResultTransformer {
  transform(results: Map<string, Promise<any>>): Array<AbstractMeasure>
}
