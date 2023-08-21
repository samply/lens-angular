import { Injectable } from '@angular/core';
import { Measure, UnrestrictedMeasure, ResultTransformer, Stratifier } from '@samply/lens-core';

@Injectable({
  providedIn: 'root'
})
// THis class does pass through the query result measure
export class MeasurePassthroughService implements ResultTransformer {

  constructor() { }

  transform(results: Map<string, any>): UnrestrictedMeasure[] {
    const measures: Array<UnrestrictedMeasure> = []

         results.forEach((data, requestTarget) => {
            if (data != undefined && data.group instanceof Array) {
             measures.push(new UnrestrictedMeasure(requestTarget,[data]))
         }
        }
        )
        
         return measures;
  }


}
