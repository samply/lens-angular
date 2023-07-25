export type ConditionTypes =
  "EQUALS"
  | "NOT_EQUALS"
  | "IN"
  | "BETWEEN"
  | "LOWER_THAN"
  | "GREATER_THAN"
  | "CONTAINS";

export class Condition {
  constructor(
    public key: string = "",
    public type: ConditionTypes = "EQUALS",
    public system?: string,
    public value?: string | string[] | boolean | number | {min: number, max: number} | {min: Date | undefined, max: Date | undefined},
    public de?: string
  ) {
  }

  isEmpty(): boolean {
    let stringEmpty = (this.value === '') || ((this.value instanceof Array) && (this.value.length == 0))
    let booleanEmpty = (this.value === false);
    let numberEmpty = (typeof this.value == "object" && !(this.value instanceof Array<string>)) ? (this.value.min == 0 && this.value.max == 0) : this.value == 0;
    let dateEmpty = (typeof this.value == "object" && !(this.value instanceof Array<string>)) ? (this.value.min == undefined && this.value.max == undefined) : false
    return stringEmpty || booleanEmpty || numberEmpty || dateEmpty;
  }

  isValid(): boolean {
    if (this.isEmpty()) {
      return true;
    }
    let stringValid = (typeof this.value == "string");
    let stringArrayValid = (typeof this.value == "object" && (this.value instanceof Array<string>))
    let booleanValid = (typeof this.value == "boolean");
    let numberValid = (typeof this.value == "number" && this.value > 0)
    let numberMinMaxValid = (typeof this.value == "object" && !(this.value instanceof Array) && typeof this.value.min == "number" && typeof this.value.max == "number") ? (
      (this.type == "GREATER_THAN" && this.value.min > 0) ||
      (this.type == "BETWEEN" && this.value.min <= this.value.max) ||
      (this.type == "LOWER_THAN" && this.value.max > 0)
    ) : false
    let dateMinMaxValid = (typeof this.value == "object" && !(this.value instanceof Array) && ((this.value.min instanceof Date) || (this.value.max instanceof Date))) ? (
     (this.value.min instanceof Date && this.value.max == undefined) ||
     (this.value.min == undefined && this.value.max instanceof Date) ||
     (this.value.min instanceof Date && this.value.max instanceof Date && this.value.min <= this.value.max)
    ) : false
    return stringValid || stringArrayValid || booleanValid || numberValid || numberMinMaxValid || dateMinMaxValid;
  }

  toString(): string {
    return `${this.key} ${this.type.toLowerCase()} ${this.transformValue()}`;
  }

  transformValue(): string {
    let transformedValue = "";
    switch (typeof this.value) {
      case "string":
        transformedValue = `'${this.value}'`;
        break;
      case "object":
        if (this.value instanceof Array<string>) {
          transformedValue = `['${this.value.join("', '")}']`;
          break;
        } else if (
          typeof this.value.min == "number"
          && typeof this.value.max == "number"
        ) {
          if (this.type == "LOWER_THAN") {
            transformedValue = `${this.value.max}`;
            break;
          } else if (this.type == "GREATER_THAN") {
            transformedValue = `${this.value.min}`;
            break;
          } else if (this.type == "BETWEEN") {
            transformedValue = `${this.value.min} and ${this.value.max}`
            break;
          }
        } else if (
          this.value.min instanceof Date
          || this.value.max instanceof Date
        ) {
          if (this.type == "LOWER_THAN") {
            transformedValue = `${(<Date> this.value.max).toLocaleDateString()}`;
            break;
          } else if (this.type == "GREATER_THAN") {
            transformedValue = `${(<Date> this.value.min).toLocaleDateString()}`;
            break;
          } else if (this.type == "BETWEEN") {
            transformedValue = `${(<Date> this.value.min).toLocaleDateString()} and ${(<Date> this.value.max).toLocaleDateString()}`
            break;
          }
        }
        break
      default:
        transformedValue = `${this.value}`;
        break;
    }
    return transformedValue;
  }

  getConditionDisplay(): string {
    switch (typeof this.value) {
      case "string":
        if (this.type == "EQUALS") {
          return "equals";
        } else if (this.type == "CONTAINS") {
          return "matches";
        }
        return this.type.toLowerCase()
      case "object":
        if (this.value instanceof Array<string>) {
          return "in";
        } else if (
          typeof this.value.min == "number"
          && typeof this.value.max == "number"
        ) {
          if (this.type == "LOWER_THAN") {
            return "lower or equal to";
          } else if (this.type == "GREATER_THAN") {
            return "greater or equal to";
          }
        } else if (
          this.value.min instanceof Date
          && this.value.max instanceof Date
        ) {
          if (this.type == "LOWER_THAN") {
            return "after";
          } else if (this.type == "GREATER_THAN") {
            return "before";
          }
        }
        return this.type.toLowerCase()
      default:
        return this.type.toLowerCase();
    }
  }

  static load(unloadedCondition: Object): Condition {
    let loadedCondition = new Condition();
    let conditionToBeLoaded = <Condition> unloadedCondition;
    return Object.assign(loadedCondition, conditionToBeLoaded);
  }
}
