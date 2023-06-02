import { Pipe, PipeTransform } from '@angular/core';
import { CatalogueService } from '../services/catalogue.service';
import { Condition } from '../model/condition';
import { Criteria } from '../model/criteria';
import { Operation } from '../model/operation';

@Pipe({
  name: 'chipTransform'
})
export class ChipTransformPipe implements PipeTransform {

  constructor(
    private catalogueService: CatalogueService
  ) {
  }

  transform(value: Condition | Operation): string {
    if (value instanceof Condition) {
      switch (typeof value.value) {
        case "string":
          return value.value;
        case "object":
          if (value.value instanceof Array<string>) {
            return value.value.toString();
          }
          if (typeof value.value.min == "number" && typeof value.value.max == "number") {
            if (value.type == "LOWER_THAN") {
              return `${this.prettifyKey(value.key)} \u{2264} ${value.value.max}`
            } else if (value.type == "GREATER_THAN") {
              return `${value.value.min} \u{2264} ${this.prettifyKey(value.key)}`
            } else if (value.type == "BETWEEN") {
              return `${value.value.min} \u{2264} ${this.prettifyKey(value.key)} \u{2264} ${value.value.max}`
            }
          } else if (value.value.min instanceof Date || value.value.max instanceof Date) {
            if (value.type == "LOWER_THAN") {
              return `${this.prettifyKey(value.key)} \u{2264} ${(<Date> value.value.max).toLocaleDateString()}`
            } else if (value.type == "GREATER_THAN") {
              return `${(<Date> value.value.min).toLocaleDateString()} \u{2264} ${this.prettifyKey(value.key)}`
            } else if (value.type == "BETWEEN") {
              return `${(<Date> value.value.min).toLocaleDateString()} \u{2264} ${this.prettifyKey(value.key)} \u{2264} ${(<Date> value.value.max).toLocaleDateString()}`
            }
          }
          break
        case "number":
          return `${this.prettifyKey(value.key)} = ${value.value}`
        case "boolean":
          let valuesCriteria = this.catalogueService.getCriteria(value.key);
          return valuesCriteria.displayName.de;
        case "undefined":
          return this.prettifyKey(value.key);
        default:
          break;
      }
    } else {
      // if the value is an operation
      let valuesCriteria = this.catalogueService.getCriteria(value.key);
      if (valuesCriteria.type == 'predefined') {
        let operationDisplay = this.prettifyPredefinedOperation(value, valuesCriteria)
        return (operationDisplay != undefined && operationDisplay != "") ? operationDisplay : value.children.map(child => child.key).join(", ");
      } else {
        let operationDisplay = this.prettifyOperation(value);
        return (operationDisplay != undefined && operationDisplay != "") ? operationDisplay : value.children.map(child => child.key).join(", ");
      }
    }
    return (value.key) ? this.prettifyKey(value.key) : "undefined";
  }

  private prettifyOperation(value: Operation) {
    return value.children.map(child => {
      if (child instanceof Condition) {
        return child.value
      } else {
        return child.children.toString()
      }
    }).join(", ")
  }

  private prettifyPredefinedOperation(value: Operation, criteria: Criteria) {
    // HACK: This was the only way to check whether the prefix was already added
    let operationsStringUntilNow = "";
    return criteria
      .values?.filter(childValue => value.children.some(child => child.key == childValue.key))
      .sort((a,b) => a.de.localeCompare(b.de))
      .map((childValue, childIndex) => {
        if (childIndex == 0 ||
             operationsStringUntilNow.indexOf(childValue.de.split(" - ")[0]) == -1) {
          operationsStringUntilNow += childValue.de + ", "
          return childValue.de
        } else {
          operationsStringUntilNow += childValue.de.split(" - ")[1] + ", "
          return childValue.de.split(" - ")[1]
        }
      })
      .join(", ");
  }

  /**
   * Simple function to transform keys for display
   * */
  private prettifyKey (key: string): string {
    return key.toLowerCase().split("_").map(word => {
      return word.replace(word[0], word[0].toUpperCase())
    }).join(" ");
  }

}
