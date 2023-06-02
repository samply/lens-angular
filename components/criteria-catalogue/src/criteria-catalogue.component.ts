import {
  Component,
  OnInit
} from '@angular/core';
import {
  CatalogueService,
  QueryService,
  Condition,
  Operation
} from '@samply/lens-core';
import {TreeNode} from "primeng/api";

@Component({
  selector: 'lens-criteria-catalogue',
  templateUrl: './criteria-catalogue.component.html',
  styleUrls: ['./criteria-catalogue.component.css']
})

export class CriteriaCatalogueComponent implements OnInit {

  mdrEntityList: any

  catalogue: TreeNode[] = [];

  constructor(
    public queryService: QueryService,
    public catalogueService: CatalogueService
  ) {
  }

  ngOnInit(): void {
    this.catalogueService.convertToTreenode().then(catalogue => {
     this.catalogue = catalogue
    });
  }

  onConditionChange(condition: Condition) {
    if (condition.isEmpty()) {
      this.queryService.delete(condition);
    } else if (this.queryService.read(condition.key)) {
      this.queryService.update(condition);
    } else {
      this.queryService.create(condition);
    }
  }

}
