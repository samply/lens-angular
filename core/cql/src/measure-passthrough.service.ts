import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { UnrestrictedMeasure, ResultTransformer } from '@samply/lens-core';

@Injectable({
  providedIn: 'root',
})
// THis class does pass through the query result measure
export class MeasurePassthroughService implements ResultTransformer {
  constructor() {}

  transform(results: Map<string, any>): UnrestrictedMeasure[] {
    const measures: Array<UnrestrictedMeasure> = [];

    results.forEach((unmappedData, requestTarget) => {
      const mappedData = unmappedData.body ? unmappedData.body : unmappedData;
      // exit if there is no data to parse
      if (
        mappedData == 'unused' ||
        mappedData ==
          'Cannot execute query: FHIR Measure evaluation error in Blaze' ||
        mappedData == 'null'
      )
        return;
      const data = JSON.parse(
        Buffer.from(mappedData, 'base64').toString('binary')
      );
      if (data != undefined && data.group instanceof Array) {
        measures.push(new UnrestrictedMeasure(requestTarget, [data]));
      }
    });

    return measures;
  }
}
