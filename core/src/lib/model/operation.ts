import {Condition} from "./condition";

export type Operand = "AND" | "OR" | "NOT" | "XOR";

export class Operation {
  constructor(
    public operand: Operand = "AND",
    public children: Array<Operation | Condition> = [],
    // This will be auto-generated by gui for internal usage
    public key: string = "",
    public de: string = "",
    public en: string = ""
  ) {
  }

  find(key: string): Operation | Condition | undefined {
    return this.children.find(child => {
      return child.key == key;
    })
  }

  isEmpty(): boolean {
    return this.children.every(child => child.isEmpty())
  }

  isValid(): boolean {
    return this.children.every(child => child.isValid())
  }

  indexOf(condition: Condition): number {
    return this.children.indexOf(condition);
  }

  add(condition: Condition) {
    let conditionIndex = this.children.findIndex(child => child.key === condition.key);
    if (conditionIndex != -1) {
      let existingCondition = this.children[conditionIndex];
      if (existingCondition instanceof Condition) {
        if ((existingCondition.value instanceof Array<string>)
          && (condition.value instanceof Array<string>)) {
          existingCondition.value = existingCondition.value.concat(condition.value);
          this.children[conditionIndex] = existingCondition;
        }
      }
    } else {
      this.children.push(condition)
    }
  }

  toString():string {
    return "(" + this.children.join(") " + this.operand + " (") + ")";
  }

  static load(unloadedOperation: Object): Operation {
    let loadedOperation = new Operation();
    let operationToBeLoaded = <Operation> unloadedOperation;
    console.log(operationToBeLoaded)
    operationToBeLoaded.children = operationToBeLoaded.children.map(object => {
      if ((<Operation> object).operand == undefined) {
        return Condition.load(object)
      } else {
        return Operation.load(object)
      }
    });
    return Object.assign(loadedOperation, operationToBeLoaded);
  }

}
