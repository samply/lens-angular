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

  transform(selection: Condition | Operation): string {
    let criteria = this.catalogueService.getCriteria(selection.key);
    switch (criteria.type) {
      case "string":
        if (selection instanceof Condition && selection.value instanceof Array<string>) {
          let valueDefinitions = criteria.values?.filter(value => (<Array<string>> selection.value).indexOf(value.key) !== -1);
          if (valueDefinitions) {
            return valueDefinitions.map(selectedValue => selectedValue.display_short).toString()
          } else {
            return selection.value.toString();
          }
        } else if (selection instanceof Condition && typeof selection.value === "string") {
          let valueDefinitions = criteria.values?.filter(value => value.key === selection.value)
          if (valueDefinitions) {
            return valueDefinitions[0].display_short
          } else {
            return selection.value
          }
        }
        break;
      case "number":
        if (selection instanceof Condition && selection.value instanceof Object && !(selection.value instanceof Array<string>)) {
          if (selection.type == "LOWER_THAN") {
            return `${this.prettifyKey(selection.key)} \u{2264} ${selection.value.max}`
          } else if (selection.type == "GREATER_THAN") {
            return `${selection.value.min} \u{2264} ${criteria.display_short}`
          } else if (selection.type == "BETWEEN") {
            return `${selection.value.min} \u{2264} ${criteria.display_short} \u{2264} ${selection.value.max}`
          }
        } else {
          return `${criteria.display_short} = ${(<Condition> selection).value}`
        }
        break;
      case "boolean":
        return criteria.displayName.de;
      case "date":
        if (
          selection instanceof Condition && selection.value instanceof Object && !(selection.value instanceof Array<string>)
            && (selection.value.min instanceof Date || selection.value.max instanceof Date)) {
          if (selection.type == "LOWER_THAN") {
            return `${criteria.display_short} \u{2264} ${(<Date> selection.value.max).toLocaleDateString()}`
          } else if (selection.type == "GREATER_THAN") {
            return `${(<Date> selection.value.min).toLocaleDateString()} \u{2264} ${criteria.display_short}`
          } else if (selection.type == "BETWEEN") {
            return `${(<Date> selection.value.min).toLocaleDateString()} \u{2264} ${criteria.display_short} \u{2264} ${(<Date> selection.value.max).toLocaleDateString()}`
          } else {
            return `${criteria.display_short} = ${selection.value}`
          }
        }
        break;
      case "predefined":
        let operationDisplay = this.prettifyPredefinedOperation(<Operation> selection, criteria)
        return (operationDisplay != undefined && operationDisplay != "") ? operationDisplay : (<Operation> selection).children.map(child => child.key).join(", ");
    }
    // Test
    if (selection instanceof Operation) {
      let operationDisplay = this.prettifyOperation(selection);
      return (operationDisplay != undefined && operationDisplay != "") ? operationDisplay : selection.children.map(child => child.key).join(", ");
    } else {
      return (selection.key) ? this.prettifyKey(selection.key) : "undefined";
    }
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
      .sort((a,b) => a.display_short.localeCompare(b.de))
      .map((childValue, childIndex) => {
        if (childIndex == 0 ||
             operationsStringUntilNow.indexOf(childValue.display_short.split(" - ")[0]) == -1) {
          operationsStringUntilNow += childValue.display_short + ", "
          return childValue.display_short
        } else {
          operationsStringUntilNow += childValue.display_short.split(" - ")[1] + ", "
          return childValue.display_short.split(" - ")[1]
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
