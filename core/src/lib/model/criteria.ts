import { ConditionTypes } from "./condition";
import { Operation } from "./operation";

import { TreeNode } from "primeng/api"

export class Criteria {
  constructor(
    public key: string,
    // This refers to displayName in our model?
    public displayName: {
      de: string,
      en: string
    },
    public display_short: string,
    public type: "string" | "number" | "boolean" | "date" | "predefined",
    public system: string,
    public allowedConditionTypes: Array<ConditionTypes> = [],
    public values?: Array<{key: string, de: string, en: string, display_short: string}> | Array<Operation>
  ) {
  }

  public getCriteria(key: string): Criteria[] {
    if (this.key == key) {
      return [this];
    } else {
      return [];
    }
  }

  public displayValues(): string {
    if (this.values != undefined) {
      return this.values.map(value => value.de).join(", ")
    } else {
      return ""
    }
  }

  public convertToTreeNode(): TreeNode {
    return {
      key: this.key,
      label: this.displayName.de,
      children: [{
        key: this.key,
        label: this.displayName.de,
        type: this.type,
        data: {
          allowedConditionTypes: this.allowedConditionTypes,
          values: this.values,
          system: this.system
        }
      }]
    }
  }
}
