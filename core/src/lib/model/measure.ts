import { AbstractMeasure } from "./abstract-measure";

export class Measure implements AbstractMeasure {
  constructor(
    public key: string,
    public value: number,
    public stratifier: Array<Stratifier>
  ) { }

  findStratum(stratifierKey: string, stratumKey:string): number {
    let foundStratifier = this.findStratifier(stratifierKey)
    if (foundStratifier == undefined) {
      return 0;
    }
    let result = foundStratifier.stratum.find(stratum => {
      return stratum.key === stratumKey;
    });
    return (result != undefined) ? result.population : 0;
  }

  findStratifier(key: string): Stratifier | undefined {
    return this.stratifier.find(stratifier => {
      return stratifier.key === key;
    });
  }
}

export class Stratifier {
  constructor(
    // e.g gender
    public key: string,
    // e.g. {key: "male", population: 10}
    public stratum: Array<{ key: string, population: number }>
  ) {}

  isEmpty() {
    return this.stratum.length == 0
      || this.stratum.every(value => value.population == 0);
  }
}
