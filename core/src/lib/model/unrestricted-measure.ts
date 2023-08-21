import { AbstractMeasure } from "./abstract-measure";

export class UnrestrictedMeasure implements AbstractMeasure {
    constructor(
        public key: string,
        public stratifier: Array<any>
    ) {}
}
