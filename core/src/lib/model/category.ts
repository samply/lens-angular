import {Criteria} from "./criteria";

import {TreeNode} from "primeng/api";

export class Category {
  constructor(
    public key: string,
    public displayName: string,
    public children: Array<Category | Criteria>
  ) {
  }

  public getCriteria(key: string): Criteria {
    let candidates: Criteria[] = [];
    this.children.forEach(child => {
      let childCriteria = child.getCriteria(key);
      if (childCriteria != undefined) {
        candidates = candidates.concat(childCriteria)
      }
    });
    if (candidates.length > 1) {
      console.warn(`Detected multiple criterias with same key ${key} in category ${this.key}. Please clean your catalogue, the ui may not work as expected!`)
      console.debug(candidates)
    }
    return candidates[0];
  }

  public convertToTreeNode(): TreeNode {
    let convertedChildren: TreeNode[] = this.children.map(child => child.convertToTreeNode());
    return {
      key: this.key,
      label: this.displayName,
      children: convertedChildren
    }
  }

  public getCriterias(): Array<Criteria> {
    let result: Array<Criteria> = []
    this.children.forEach(child => {
      if (child instanceof Criteria) {
        result = result.concat(child)
      } else {
        result = result.concat(child.getCriterias());
      }
    })
    return result;
  }
}
